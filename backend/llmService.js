const axios = require('axios');

async function generateReview(diff) {
    // Calling Mistral API or similar via OpenAI-compatible endpoint
    const apiKey = process.env.MISTRAL_API_KEY;
    const url = 'https://api.mistral.ai/v1/chat/completions';
    
    if (!diff || diff.length < 5) return "No significant changes to review.";
    
    // Truncate diff if too long for the prompt
    const truncatedDiff = diff.substring(0, 3000); 

    try {
        if (apiKey && apiKey !== 'your_mistral_api_key_here') {
            const response = await axios.post(url, {
                model: 'mistral-small',
                messages: [
                    { role: 'system', content: 'You are an expert code reviewer. Review the following pull request diff for bugs, vulnerabilities, and code quality.' },
                    { role: 'user', content: truncatedDiff }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        } else {
            return "Mock Review: The code logic appears sound, but ensure there's adequate error handling. Consider refactoring for better readability.";
        }
    } catch (error) {
        console.error('LLM error:', error.message);
        return "Failed to connect to the Mistral API. Please verify your API key.";
    }
}

module.exports = { generateReview };
