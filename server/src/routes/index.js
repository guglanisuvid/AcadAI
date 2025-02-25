const router = require('express').Router();

router.use('/auth/google', require('./googleAuth.routes'));
router.use('/classes', require('./class.routes'));
router.use('/notes', require('./notes.routes'));
router.use('/quizzes', require('./quiz.routes'));
router.use('/resources', require('./resource.routes'));
router.use('/discussions', require('./discussion.routes'));

module.exports = router;