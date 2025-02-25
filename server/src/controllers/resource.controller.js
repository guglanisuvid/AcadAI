const { Resource, Class } = require('../models');

const resourceController = {

    // Create a new resource
    createResource: async (req, res) => {
        try {
            const { title, description, classId } = req.body;
            const file = req.file;
            const instructor = req.user._id;

            if (!classId) {
                return res.status(400).json({
                    message: 'Class ID is required',
                    success: false
                });
            }

            if (!file) {
                return res.status(400).json({
                    message: 'No file uploaded',
                    success: false
                });
            }

            // Check if class exists and user is instructor
            const classDoc = await Class.findById(classId);
            if (!classDoc) {
                return res.status(404).json({
                    message: 'Class not found',
                    success: false
                });
            }

            // Convert ObjectIds to strings for comparison
            const instructorId = instructor.toString();
            const classInstructorId = classDoc.instructor.toString();

            if (instructorId !== classInstructorId) {
                return res.status(403).json({
                    message: 'Not authorized',
                    success: false
                });
            }

            const resourceData = {
                title,
                description,
                classId,
                instructor,
                file: `resources/${file.filename}`
            };

            const newResource = await Resource.create(resourceData);

            await Class.findByIdAndUpdate(classId, {
                $push: { resources: newResource._id }
            });

            const populatedResource = await Resource.findById(newResource._id)
                .populate('instructor', 'name email');

            res.status(201).json({
                success: true,
                resource: populatedResource
            });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Error creating resource',
                success: false
            });
        }
    },

    // Get all resources for a class
    getResourcesByClassId: async (req, res) => {
        try {
            const { classId } = req.params;
            const userId = req.user._id;

            // Check if class exists
            const classDoc = await Class.findById(classId);
            if (!classDoc) {
                return res.status(404).json({
                    message: 'Class not found',
                    success: false
                });
            }

            // Check if user has access (is instructor or enrolled student)
            const isInstructor = classDoc.instructor.toString() === userId.toString();
            const isStudent = classDoc.students.includes(userId);

            if (!isInstructor && !isStudent) {
                return res.status(403).json({
                    message: 'Not authorized to view resources',
                    success: false
                });
            }

            const resources = await Resource.find({ classId })
                .populate('instructor', 'name email')
                .sort({ createdAt: -1 });

            res.status(200).json(resources);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching resources',
                success: false
            });
        }
    },

    // Get a single resource
    getResourceById: async (req, res) => {
        try {


            const { resourceId } = req.params;
            const userId = req.user._id;


            const resource = await Resource.findById(resourceId)
                .populate('instructor', 'name email')
                .populate('classId', 'title students instructor');


            if (!resource) {
                return res.status(404).json({
                    message: 'Resource not found',
                    success: false

                });

            }

            // Check if user has access to this resource
            const isInstructor = resource.instructor._id.toString() === userId.toString();
            const isStudent = resource.classId.students.includes(userId);

            if (!isInstructor && !isStudent) {
                return res.status(403).json({
                    message: 'Not authorized to view this resource',
                    success: false
                });

            }

            res.status(200).json(resource);
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Error fetching resource',
                success: false
            });
        }
    },

    // Delete a resource (only instructor can delete)
    deleteResource: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            // Find the resource
            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({
                    message: 'Resource not found',
                    success: false
                });
            }

            // Check if user is the instructor of the class
            const classDoc = await Class.findById(resource.classId);
            if (!classDoc) {
                return res.status(404).json({
                    message: 'Class not found',
                    success: false
                });
            }

            if (classDoc.instructor.toString() !== userId.toString()) {
                return res.status(403).json({
                    message: 'Not authorized to delete this resource',
                    success: false
                });
            }

            // Delete the file from uploads directory
            if (resource.file) {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(__dirname, '../../uploads/', resource.file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Remove resource from class
            await Class.findByIdAndUpdate(resource.classId, {
                $pull: { resources: resource._id }
            });

            // Delete the resource
            await Resource.findByIdAndDelete(id);

            res.status(200).json({
                message: 'Resource deleted successfully',
                success: true
            });
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Error deleting resource',
                success: false
            });
        }
    }
};

module.exports = resourceController;