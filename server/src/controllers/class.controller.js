const { Class, User } = require('../models');
const crypto = require('crypto');

const classController = {
    generateUniqueClassCode: async (instructorId, attempt = 1) => {
        try {
            // Check max attempts
            if (attempt > 3) {
                throw new Error('Failed to generate unique class code');
            }

            // Generate 6 random characters
            const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Combine all parts
            const combinedString = `${instructorId}${randomPart}`;

            // Generate 12-char hash from combined string
            const classCode = crypto
                .createHash('sha256')
                .update(combinedString)
                .digest('hex')
                .substring(0, 12)
                .toUpperCase();

            // Check if code exists
            const existingClass = await Class.findOne({ classCode });

            if (existingClass) {
                // If code exists, try again
                return classController.generateUniqueClassCode(instructorId, attempt + 1);
            }

            return classCode;
        } catch (error) {
            throw new Error(`Class code generation failed: ${error.message}`);
        }
    },

    // Create a new class
    createClass: async (req, res) => {
        try {
            const { title, description } = req.body;
            const instructor = req.user._id;

            // Generate class code first
            const classCode = await classController.generateUniqueClassCode(instructor);

            // Create class with generated code
            const newClass = await Class.create({
                title,
                description,
                instructor,
                classCode
            });

            // Add class to instructor's created classes
            await User.findByIdAndUpdate(instructor, {
                $push: { createdClasses: newClass._id }
            });

            res.status(201).json(newClass);
        } catch (error) {
            // If class was created but something else failed, delete it
            if (newClass) {
                try {
                    await Class.findByIdAndDelete(newClass._id);
                    // Also remove from instructor's created classes if needed
                    if (req.user?._id) {
                        await User.findByIdAndUpdate(req.user._id, {
                            $pull: { createdClasses: newClass._id }
                        });
                    }
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }

            res.status(500).json({
                message: error.message,
                success: false
            });
        }
    },

    // Join a class
    joinClass: async (req, res) => {
        try {
            const { classCode } = req.body;
            const studentId = req.user._id;

            const classToJoin = await Class.findOne({ classCode });
            if (!classToJoin) {
                return res.status(404).json({ message: 'Class not found' });
            }

            if (classToJoin.students.includes(studentId)) {
                return res.status(400).json({ message: 'Already enrolled in this class' });
            }

            classToJoin.students.push(studentId);
            await classToJoin.save();

            // Add class to student's enrolled classes
            await User.findByIdAndUpdate(studentId, {
                $push: { enrolledClasses: classToJoin._id }
            });

            res.json(classToJoin);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get classes (different for student and instructor)
    getClasses: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            let classes;

            if (user.role === 'instructor') {
                // For instructors, get classes they created
                classes = await Class.find({ instructor: req.user._id });
            } else {
                // For students, get classes they're enrolled in
                classes = await Class.find({ students: req.user._id });
            }

            res.json(classes);
        } catch (error) {
            console.error('Error in getClasses:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get class by ID
    getClassById: async (req, res) => {
        try {
            const classId = req.params.id;
            const classDoc = await Class.findById(classId);
            if (!classDoc) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.json(classDoc);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Edit a class
    editClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const { title, description } = req.body;
            const instructorId = req.user._id;

            // Find the class and verify ownership
            const classToEdit = await Class.findById(classId);
            if (!classToEdit) {
                return res.status(404).json({ message: 'Class not found' });
            }

            // Verify the instructor owns this class
            if (classToEdit.instructor.toString() !== instructorId.toString()) {
                return res.status(403).json({ message: 'Not authorized to edit this class' });
            }

            // Update the class
            const updatedClass = await Class.findByIdAndUpdate(
                classId,
                { title, description },
                { new: true } // Return the updated document
            );

            res.json(updatedClass);
        } catch (error) {
            console.error('Error editing class:', error);
            res.status(500).json({ message: 'Error editing class' });
        }
    },

    // Leave class (for students)
    leaveClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const classToLeave = await Class.findById(classId);

            if (!classToLeave) {
                return res.status(404).json({ message: 'Class not found' });
            }

            // Remove student from class
            classToLeave.students = classToLeave.students.filter(
                studentId => studentId.toString() !== req.user._id.toString()
            );

            await classToLeave.save();
            res.json({ message: 'Successfully left the class' });
        } catch (error) {
            res.status(500).json({ message: 'Error leaving class' });
        }
    },

    // Delete class (for instructors)
    deleteClass: async (req, res) => {
        try {
            const classId = req.params.id;
            const classToDelete = await Class.findById(classId);

            if (!classToDelete) {
                return res.status(404).json({ message: 'Class not found' });
            }

            // Verify the instructor owns this class
            if (classToDelete.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this class' });
            }

            await Class.findByIdAndDelete(classId);
            res.json({ message: 'Class deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting class' });
        }
    }
};

module.exports = classController;