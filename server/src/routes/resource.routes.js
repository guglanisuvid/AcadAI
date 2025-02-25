const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

router.post('/create', auth.protect, auth.instructor, upload.single('file'), resourceController.createResource);
router.get('/class/:classId', auth.protect, resourceController.getResourcesByClassId);
router.get('/:id', auth.protect, resourceController.getResourceById);
router.delete('/:id/delete', auth.protect, auth.instructor, resourceController.deleteResource);


module.exports = router;