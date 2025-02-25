const router = require('express').Router();
const classController = require('../controllers/class.controller');
const auth = require('../middleware/auth');

router.get('/', auth.protect, classController.getClasses);
router.post('/create', auth.protect, auth.instructor, classController.createClass);
router.post('/join', auth.protect, auth.student, classController.joinClass);
router.get('/:id', auth.protect, classController.getClassById);
router.put('/:id/edit', auth.protect, auth.instructor, classController.editClass);
router.delete('/:id/delete', auth.protect, auth.instructor, classController.deleteClass);
router.post('/:id/leave', auth.protect, auth.student, classController.leaveClass);


module.exports = router;