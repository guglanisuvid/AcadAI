const { Class, Discussion } = require('../models');

const discussionController = {
    // Create a discussion
    createDiscussion: async (req, res) => {
        try {
            const { question, classId } = req.body;

            // Create a new discussion
            const discussion = await Discussion.create({
                question,
                askedBy: req.user._id,
                classId
            });

            await Class.findByIdAndUpdate(classId, {
                $push: { discussions: discussion._id }
            });

            res.status(201).json({
                success: true,
                message: "Discussion created successfully",
                discussion: await discussion.populate('askedBy', 'name email avatar')
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating discussion."
            });
        }
    },

    // Get all discussions for a user in a class
    getDiscussionsByClassId: async (req, res) => {
        try {
            const { classId } = req.params;

            // Get class document
            const classDoc = await Class.findOne({
                _id: classId
            });

            // If class is not found, return 403
            if (!classDoc) {
                return res.status(403).json({ message: 'Not authorized to view discussions for this class' });
            }

            // Get notes for the class
            const discussions = await Discussion.find({ classId })
                .populate('askedBy', 'name email avatar');

            res.json({
                success: true,
                discussions
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching discussions' });
        }
    },

    // Get a discussion by id
    getDiscussionById: async (req, res) => {
        try {
            const { id } = req.params;

            const discussion = await Discussion.findById(id)
                .populate('askedBy', 'name email avatar')
                .populate({
                    path: 'answers.answeredBy',
                    select: 'name email avatar'
                });

            if (!discussion) {
                return res.status(404).json({ message: 'Discussion not found' });
            }

            res.json({
                success: true,
                discussion
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Answer a discussion
    answerDiscussion: async (req, res) => {
        try {
            const { id } = req.params;
            const { answers } = req.body;

            // Find discussion
            const discussion = await Discussion.findById(id);
            if (!discussion) {
                return res.status(404).json({
                    message: 'Discussion not found',
                    success: false
                });
            }

            discussion.answers = [...answers, ...discussion.answers];
            await discussion.save();

            res.json({
                message: 'Discussion answered successfully',
                success: true,
                discussion: await Discussion.findById(id)
                    .populate({
                        path: 'answers.answeredBy',
                        select: 'name email avatar'
                    })
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a discussion
    deleteDiscussion: async (req, res) => {
        try {
            const { id } = req.params;

            // Find discussion and verify ownership
            const discussion = await Discussion.findById(id);

            if (!discussion) {
                return res.status(404).json({
                    message: 'Discussion not found',
                    success: false
                });
            }

            await Class.findByIdAndUpdate(discussion.classId, {
                $pull: { discussions: discussion._id }
            });

            // Delete notes
            await Discussion.findByIdAndDelete(id);

            res.json({
                message: 'Discussion deleted successfully',
                success: true
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = discussionController;