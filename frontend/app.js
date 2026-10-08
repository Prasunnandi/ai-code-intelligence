let currentDiff = "";

async function analyzePR() {
    const owner = document.getElementById('owner').value;
    const repo = document.getElementById('repo').value;
    const pull_number = document.getElementById('pr-number').value;
    
    if (!owner || !repo || !pull_number) {
        alert("Please fill in all fields.");
        return;
    }

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');
    
    try {
        const response = await fetch('/api/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner, repo, pull_number })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('review-content').textContent = data.review;
            currentDiff = data.diff;
            document.getElementById('results-container').classList.remove('hidden');
            document.getElementById('chat-history').innerHTML = ''; // Clear chat history
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Failed to connect to backend server. Make sure it is running.');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;
    
    appendChatMessage('user', message);
    input.value = '';
    
    const chatHistory = document.getElementById('chat-history');
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, diff: currentDiff })
        });
        
        const data = await response.json();
        if (data.success) {
            appendChatMessage('llm', data.reply);
        } else {
            appendChatMessage('llm', 'Error: ' + data.message);
        }
    } catch (error) {
        appendChatMessage('llm', 'Failed to connect to backend.');
    }
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function appendChatMessage(role, text) {
    const history = document.getElementById('chat-history');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    history.appendChild(bubble);
}
