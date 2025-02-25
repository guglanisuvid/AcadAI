const router = require('express').Router();
const googleAuthController = require('../controllers/googleAuth.controller');
const auth = require('../middleware/auth');

router.get('/url', googleAuthController.getAuthUrl);
router.post('/callback', googleAuthController.handleCallback);
router.post('/role', auth.protect, googleAuthController.setRole);
router.get('/user', auth.protect, googleAuthController.getUser);

module.exports = router;