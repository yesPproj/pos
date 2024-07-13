const express = require('express');
const router = express.Router();
const Credential = require('../models/Credential');
const { getGoogleAuthURL, getGoogleSheetsClient } = require('../googleSheets');
const { getSlackAuthURL, getSlackClient } = require('../slack');

// Save credentials
router.post('/api/save-credentials', async (req, res) => {
    const {
        apiKey,
        apiSecret,
        googleClientId,
        googleClientSecret,
        googleRedirectUri,
        slackClientId,
        slackClientSecret
    } = req.body;

    try {
        const newCredential = new Credential({
            apiKey,
            apiSecret,
            googleClientId,
            googleClientSecret,
            googleRedirectUri,
            slackClientId,
            slackClientSecret
        });
        await newCredential.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving credentials:', error);
        res.status(500).json({ success: false, error: 'An error occurred while saving credentials.' });
    }
});

// Remove credentials
router.delete('/api/remove-credentials', async (req, res) => {
    try {
        await Credential.deleteMany({});
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing credentials:', error);
        res.status(500).json({ success: false, error: 'An error occurred while removing credentials.' });
    }
});

// Google Sheets routes
router.get('/api/google-auth-url', (req, res) => {
    const url = getGoogleAuthURL();
    res.json({ url });
});

router.get('/api/google-auth-callback', async (req, res) => {
    const code = req.query.code;
    try {
        const sheets = await getGoogleSheetsClient(code);
        res.json({ success: true });
    } catch (error) {
        console.error('Error authenticating with Google Sheets:', error);
        res.status(500).json({ success: false, error: 'An error occurred while authenticating with Google Sheets.' });
    }
});

// Slack routes
router.get('/api/slack-auth-url', (req, res) => {
    const url = getSlackAuthURL();
    res.json({ url });
});

router.get('/api/slack-auth-callback', async (req, res) => {
    const code = req.query.code;
    try {
        const slackClient = await getSlackClient(code);
        res.json({ success: true });
    } catch (error) {
        console.error('Error authenticating with Slack:', error);
        res.status(500).json({ success: false, error: 'An error occurred while authenticating with Slack.' });
    }
});

module.exports = router;
