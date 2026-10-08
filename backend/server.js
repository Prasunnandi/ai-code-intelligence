require('dotenv').config();
const express = require('express');
const cors = require('cors');
const githubService = require('./githubService');
const llmService = require('./llmService');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/review', async (req, res) => {
    const { owner, repo, pull_number } = req.body;
    try {
        const diff = await githubService.getPullRequestDiff(owner, repo, pull_number);
        const review = await llmService.generateReview(diff);
        res.json({ success: true, review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
