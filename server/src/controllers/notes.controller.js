const { Class, Notes } = require('../models');

const noteController = {
    // Create a note
    createNote: async (req, res) => {

        try {
            const { title, classId } = req.body;

            // Create a new note
            const note = await Notes.create({
                title,
                creator: req.user.id,
                classId
            });

            await Class.findByIdAndUpdate(classId, {
                $push: { notes: note._id }
            });

            res.status(201).json({
                note
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating note."
            });
        }
    },

    // Get all notes for a user in a class
    getNotesByUserId: async (req, res) => {
        try {
            const { classId } = req.params;
            const { id } = req.user;

            // Get class document
            const classDoc = await Class.findOne({
                _id: classId
            });

            // If class is not found, return 403
            if (!classDoc) {
                return res.status(403).json({ message: 'Not authorized to view notes for this class' });
            }

            // Get notes for the class
            const notes = await Notes.find({ creator: id });

            res.json({
                success: true,
                notes
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notes' });
        }
    },

    // Get a note by id
    getNoteById: async (req, res) => {
        try {
            const { id } = req.params;
            const notes = await Notes.findById(id);

            if (!notes) {
                return res.status(404).json({ message: 'Notes not found' });
            }

            res.json({
                success: true,
                notes
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update a note
    editNote: async (req, res) => {
        try {
            const { content } = req.body;
            const { id } = req.params;

            // Validate input
            if (!content || typeof content !== 'object') {
                return res.status(400).json({ message: 'Invalid or missing blocks data' });
            }

            const note = await Notes.findById(id);

            note.content = content;

            await note.save();

            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }

            res.status(200).json({ message: "Note updated successfully", content: note.content });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update a note title
    editTitle: async (req, res) => {
        try {
            const { title } = req.body;
            const { id } = req.params;

            const note = await Notes.findById(id);

            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }

            note.title = title;

            await note.save();

            res.status(200).json({ message: "Note updated successfully", note });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a note
    deleteNote: async (req, res) => {
        try {
            const { id } = req.params;

            // Find notes and verify ownership
            const note = await Notes.findById(id);
            if (!note) {
                return res.status(404).json({
                    message: 'Quiz not found',
                    success: false
                });
            }

            // Verify instructor owns this notes
            const classDoc = await Class.findById(note.classId);
            if (!classDoc) {
                return res.status(404).json({
                    message: 'Class not found',
                    success: false
                });
            }

            // Remove notes from class
            await Class.findByIdAndUpdate(note.classId, {
                $pull: { notes: note._id }
            });

            // Delete notes
            await Notes.findByIdAndDelete(id);

            res.json({
                message: 'notes deleted successfully',
                success: true
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = noteController;