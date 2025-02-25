const { Quiz, Class } = require('../models');

const quizController = {
    // Create a quiz
    createNewQuiz: async (req, res) => {
        try {
            const { title, classId, duration, validTill } = req.body;

            const quiz = await Quiz.create({
                title,
                classId,
                creator: req.user._id,
                duration,
                validTill

            });

            await Class.findByIdAndUpdate(classId, {
                $push: { quizzes: quiz._id }
            });

            res.status(201).json(quiz);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addQuestionsToQuiz: async (req, res) => {
        try {
            const { questions } = req.body;
            const instructorId = req.user._id;
            const quizId = req.params.id;

            const quiz = await Quiz.findById(quizId);

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            // Verify instructor owns this quiz
            if (quiz.creator.toString() !== instructorId.toString()) {
                return res.status(403).json({ message: 'Not authorized to modify this quiz' });
            }

            // Validate questions format
            if (!Array.isArray(questions)) {
                return res.status(400).json({ message: 'Questions must be an array' });
            }

            // Add questions to quiz
            quiz.questions = [...quiz.questions, ...questions];
            await quiz.save();

            // Return populated quiz
            const updatedQuiz = await Quiz.findById(quizId)
                .populate('creator', 'name')
                .populate('classId', 'title');

            res.json({
                success: true,
                quiz: updatedQuiz
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get quiz details
    getQuizById: async (req, res) => {
        try {
            const quiz = await Quiz.findById(req.params.id)

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            res.json({
                success: true,
                quiz
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get quizzes for a class
    getQuizzesByClassId: async (req, res) => {
        try {
            const { classId } = req.params;

            // Get class document
            const classDoc = await Class.findOne({
                _id: classId
            });

            // If class is not found, return 403
            if (!classDoc) {
                return res.status(403).json({ message: 'Not authorized to view quizzes for this class' });
            }

            // Get quizzes for the class
            const quizzes = await Quiz.find({ classId });

            res.json({
                success: true,
                quizzes: req.user.role === 'instructor' ? quizzes : quizzes.filter(quiz => quiz.isPublished)
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching quizzes' });
        }


    },

    // Edit quiz
    editQuiz: async (req, res) => {
        try {
            const { title, validTill, duration } = req.body;
            const instructorId = req.user._id;
            const quizId = req.params.id;

            // Find quiz and verify ownership
            const quiz = await Quiz.findById(quizId);

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            // Verify instructor owns this quiz
            if (quiz.creator.toString() !== instructorId.toString()) {
                return res.status(403).json({ message: 'Not authorized to edit this quiz' });
            }

            // Update quiz
            const updatedQuiz = await Quiz.findByIdAndUpdate(
                quizId,
                {
                    title,
                    validTill,
                    duration
                },
                { new: true }
            );

            res.json({
                success: true,
                quiz: updatedQuiz
            });
        } catch (error) {
            res.status(500).json({ message: 'Error editing quiz' });
        }
    },

    publishQuiz: async (req, res) => {
        try {
            const quiz = await Quiz.findById(req.params.id);

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            // Verify instructor owns this quiz
            if (quiz.creator.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to publish this quiz' });
            }

            // Check if quiz has questions
            if (!quiz.questions || quiz.questions.length === 0) {
                return res.status(400).json({ message: 'Cannot publish quiz without questions' });
            }

            quiz.isPublished = true;
            await quiz.save();


            res.json({ message: 'Quiz published successfully', quiz });
        } catch (error) {
            res.status(500).json({ message: 'Error publishing quiz' });
        }
    },

    // Delete quiz
    deleteQuiz: async (req, res) => {
        try {
            const { id } = req.params;
            const instructorId = req.user._id;

            // Find quiz and verify ownership
            const quiz = await Quiz.findById(id);
            if (!quiz) {
                return res.status(404).json({
                    message: 'Quiz not found',
                    success: false
                });
            }



            // Verify instructor owns this quiz
            const classDoc = await Class.findById(quiz.classId);
            if (!classDoc) {
                return res.status(404).json({
                    message: 'Class not found',
                    success: false
                });
            }

            if (classDoc.instructor.toString() !== instructorId.toString()) {
                return res.status(403).json({
                    message: 'Not authorized to delete this quiz',
                    success: false
                });
            }

            // Remove quiz from class
            await Class.findByIdAndUpdate(quiz.classId, {
                $pull: { quizzes: quiz._id }
            });

            // Delete quiz
            await Quiz.findByIdAndDelete(id);

            res.json({
                message: 'Quiz deleted successfully',
                success: true
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting quiz',

                success: false
            });
        }
    },

    // Attempt quiz
    attemptQuiz: async (req, res) => {
        try {
            const { answers, submittedAt } = req.body;
            const studentId = req.user._id;
            const quizId = req.params.id;

            // Find quiz
            const quiz = await Quiz.findById(quizId);

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            // Validate answers format
            if (!Array.isArray(answers)) {
                return res.status(400).json({ message: 'Answers must be an array' });
            }

            const existingStudentAttempt = quiz.attempts.find(attempt => attempt.studentId.toString() === studentId.toString());

            // Check if student has already attempted quiz
            if (existingStudentAttempt) {
                const existingAnswerToQuestion = existingStudentAttempt.answers.find(existingAnswer => existingAnswer.questionIndex.toString() === answers[0].questionIndex.toString());
                // Check if student has already answered this question
                if (existingAnswerToQuestion) {
                    // Update existing answer
                    existingAnswerToQuestion.selectedOption = answers[0].selectedOption;
                } else {
                    // Add new answer
                    existingStudentAttempt.answers = [...existingStudentAttempt.answers, ...answers];
                }
                existingStudentAttempt.submittedAt = submittedAt;
            } else {
                // Create new attempt for student
                quiz.attempts = [...quiz.attempts, { studentId, answers, submittedAt }];
            }

            // Sort answers by question index
            quiz.attempts.forEach(attempt => {
                attempt.answers.sort((a, b) => a.questionIndex - b.questionIndex);
            });

            await quiz.save();

            const studentAttempt = quiz.attempts.find(attempt => attempt.studentId.toString() === studentId.toString());

            // Return updated quiz
            if (!studentAttempt) {
                return res.status(404).json({ message: 'Upadated quiz not found' });
            }

            res.json({
                success: true,
                quiz: studentAttempt
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAttemptResultByStudent: async (req, res) => {
        try {
            const quiz = await Quiz.findById(req.params.id)

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            res.json({
                success: true,
                quizDetails: {
                    title: quiz.title,
                    duration: quiz.duration,
                    validTill: quiz.validTill,
                    classId: quiz.classId,
                },
                studentAnswers: quiz.attempts.find(attempt => attempt.studentId.toString() === req.user._id.toString()),
                answers: quiz.questions
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    calculateScore: async (req, res) => {
        try {
            const quiz = await Quiz.findById(req.params.id)

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            const studentAttempt = quiz.attempts.find(attempt => attempt.studentId.toString() === req.user._id.toString());

            if (!studentAttempt) {
                return res.status(404).json({ message: 'Attempt not found' });
            }

            let score = 0;

            studentAttempt.answers.forEach((answer, index) => {
                if (answer.selectedOption === quiz.questions[index].correctOption) {
                    score++;
                }
            });

            if (score === -1) {
                score = 0;
            };

            studentAttempt.score = score;

            await quiz.save();

            res.json({
                success: true,
                score: score
            });
        } catch {
            res.status(500).json({ message: error.message });
        }
    },

    // Get quiz analytics
    getQuizAnalytics: async (req, res) => {
        try {
            const quiz = await Quiz.findById(req.params.id).populate('attempts.studentId', 'name email avatar _id');

            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            res.json({
                success: true,
                quiz: {
                    title: quiz.title,
                    duration: quiz.duration,
                    validTill: quiz.validTill,
                    classId: quiz.classId
                },
                attempts: quiz.attempts,
                questions: quiz.questions
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = quizController;