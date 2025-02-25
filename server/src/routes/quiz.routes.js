const router = require('express').Router();
const quizController = require('../controllers/quiz.controller');
const auth = require('../middleware/auth');

router.post('/create', auth.protect, auth.instructor, quizController.createNewQuiz);
router.put('/:id/add-questions', auth.protect, auth.instructor, quizController.addQuestionsToQuiz);
router.put('/:id/edit', auth.protect, auth.instructor, quizController.editQuiz);
router.put('/:id/attempt', auth.protect, auth.student, quizController.attemptQuiz);
router.get('/:id/attempt-result', auth.protect, auth.student, quizController.getAttemptResultByStudent);
router.get('/:id/analytics', auth.protect, auth.instructor, quizController.getQuizAnalytics);
router.put('/:id/calculate-score', auth.protect, quizController.calculateScore);
router.get('/class/:classId', auth.protect, quizController.getQuizzesByClassId);
router.get('/:id', auth.protect, quizController.getQuizById);
router.put('/:id/publish', auth.protect, auth.instructor, quizController.publishQuiz);
router.delete('/:id/delete', auth.protect, auth.instructor, quizController.deleteQuiz);

module.exports = router;