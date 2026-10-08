const axios = require('axios');

async function getPullRequestDiff(owner, repo, pull_number) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.diff',
                'Authorization': process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : undefined
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch PR diff: ' + error.message);
    }
}

module.exports = { getPullRequestDiff };
