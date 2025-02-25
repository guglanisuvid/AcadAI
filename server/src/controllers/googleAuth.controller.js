const { User } = require('../models');
const { generateTokens } = require('../config/auth');
const { google } = require('googleapis');

const googleAuthController = {
    // Initialize OAuth2 client
    oauth2Client: new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    ),

    // Get Google Auth URL
    getAuthUrl: async (req, res) => {
        try {
            const url = googleAuthController.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ],
                prompt: 'consent select_account',
                include_granted_scopes: true
            });
            res.json({ success: true, url });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error generating auth URL'
            });
        }
    },

    // Handle Google OAuth callback
    handleCallback: async (req, res) => {
        try {
            const { code } = req.body;
            if (!code) {
                throw new Error('No authorization code received');
            }

            // Exchange code for tokens
            let tokens;
            try {
                const response = await googleAuthController.oauth2Client.getToken(code);
                tokens = response.tokens;
            } catch (tokenError) {
                throw new Error('Invalid or expired authorization code');
            }

            if (!tokens) {
                throw new Error('Failed to get tokens');
            }

            // Set credentials
            googleAuthController.oauth2Client.setCredentials(tokens);

            // Verify the ID token
            const ticket = await googleAuthController.oauth2Client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();

            const { name, email, picture: avatar, sub: googleId } = payload;

            // Find or create user
            let user = await User.findOne({ googleId });
            if (!user) {
                user = await User.findOne({ email });
            }

            if (!user) {
                user = await User.create({
                    name,
                    email,
                    googleId,
                    avatar: avatar.replace('=s96-c', '=s400-c')
                });
            }

            // Generate JWT tokens
            const authTokens = generateTokens(user._id);

            // Return user data and token
            res.json({
                success: true,
                token: authTokens.accessToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Set user role
    setRole: async (req, res) => {
        try {
            const { role } = req.body;
            const userId = req.user._id;

            // Validate role
            if (!['student', 'instructor'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role'
                });
            }

            // Update user role
            const user = await User.findByIdAndUpdate(
                userId,
                { role },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                role: user.role
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error setting role'
            });
        }
    },

    // Get user
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-__v');
            res.json(user);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user data'
            });
        }
    }
};

module.exports = googleAuthController;