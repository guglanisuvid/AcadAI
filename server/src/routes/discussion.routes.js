const router = require('express').Router();
const discussionController = require('../controllers/discussion.controller');
const auth = require('../middleware/auth');

router.get('/class/:classId', auth.protect, discussionController.getDiscussionsByClassId);
router.post('/create', auth.protect, auth.student, discussionController.createDiscussion);
router.get('/:id', auth.protect, discussionController.getDiscussionById);
router.put('/:id/answer', auth.protect, discussionController.answerDiscussion);
router.delete('/:id/delete', auth.protect, discussionController.deleteDiscussion);

module.exports = router;