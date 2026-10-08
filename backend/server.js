require('dotenv').config();
const express = require('express');
const cors = require('cors');
const githubService = require('./githubService');
const llmService = require('./llmService');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/review', async (req, res) => {
    const { owner, repo, pull_number } = req.body;
    try {
        const diff = await githubService.getPullRequestDiff(owner, repo, pull_number);
        const review = await llmService.generateReview(diff);
        res.json({ success: true, review, diff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, diff } = req.body;
    try {
        const reply = await llmService.generateChatReply(message, diff);
        res.json({ success: true, reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Catch-all route to serve the UI for any other path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
