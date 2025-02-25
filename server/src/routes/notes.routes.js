const router = require('express').Router();
const notesController = require('../controllers/notes.controller');
const auth = require('../middleware/auth');

router.get('/class/:classId', auth.protect, auth.student, notesController.getNotesByUserId);
router.post('/create', auth.protect, auth.student, notesController.createNote);
router.get('/:id', auth.protect, auth.student, notesController.getNoteById);
router.put('/:id/edit', auth.protect, auth.student, notesController.editNote);
router.put('/:id/edit-title', auth.protect, auth.student, notesController.editTitle);
router.delete('/:id/delete', auth.protect, auth.student, notesController.deleteNote);

module.exports = router;