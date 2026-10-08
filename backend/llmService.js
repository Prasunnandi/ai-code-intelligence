const axios = require('axios');

async function generateReview(diff) {
    const hfToken = process.env.HF_TOKEN;
    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
    
    if (!diff || diff.length < 5) return "No significant changes to review.";
    
    const truncatedDiff = diff.substring(0, 3000); 
    const prompt = `<s>[INST] You are an expert code reviewer. Review the following pull request diff for bugs, vulnerabilities, and code quality.\n\n${truncatedDiff} [/INST]`;

    try {
        const response = await axios.post(url, {
            inputs: prompt,
            parameters: {
                max_new_tokens: 512,
                return_full_text: false
            }
        }, {
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // Handle potential API timeouts cleanly
        });
        
        if (response.data && response.data.length > 0 && response.data[0].generated_text) {
            return response.data[0].generated_text.trim();
        }
        return "Unexpected response format from Hugging Face API.";
    } catch (error) {
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            return `❌ **Network Blocked**: Your local internet is blocking access to Hugging Face API (\`${error.code}\`).\n\n**Fix:** Deploy this Node.js backend to a cloud provider like Render or Railway, where the API will work perfectly.`;
        }
        console.error('LLM error:', error.message);
        return "Failed to connect to the Hugging Face API. Please verify your token or try again later. " + error.message;
    }
}

async function generateChatReply(message, diff) {
    const hfToken = process.env.HF_TOKEN;
    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
    
    const truncatedDiff = diff ? diff.substring(0, 3000) : "";
    const prompt = `<s>[INST] You are an AI assistant helping a developer understand a PR. The diff is:\n${truncatedDiff}\n\nUser: ${message} [/INST]`;

    try {
        const response = await axios.post(url, {
            inputs: prompt,
            parameters: {
                max_new_tokens: 512,
                return_full_text: false
            }
        }, {
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // Handle potential API timeouts cleanly
        });
        
        if (response.data && response.data.length > 0 && response.data[0].generated_text) {
            return response.data[0].generated_text.trim();
        }
        return "Unexpected response format from Hugging Face API.";
    } catch (error) {
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            return `❌ **Network Blocked**: Your local internet is blocking access to Hugging Face API (\`${error.code}\`).\n\n**Fix:** Deploy this Node.js backend to a cloud provider like Render or Railway, where the API will work perfectly.`;
        }
        console.error('LLM error:', error.message);
        return "Failed to connect to the Hugging Face API. Please verify your token or try again later. " + error.message;
    }
}

module.exports = { generateReview, generateChatReply };
