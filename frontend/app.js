async function analyzePR() {
    const owner = document.getElementById('owner').value;
    const repo = document.getElementById('repo').value;
    const pull_number = document.getElementById('pr-number').value;
    
    if (!owner || !repo || !pull_number) {
        alert("Please fill in all fields.");
        return;
    }

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    
    try {
        const response = await fetch('http://localhost:3000/api/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner, repo, pull_number })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('review-content').textContent = data.review;
            document.getElementById('results').classList.remove('hidden');
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Failed to connect to backend server. Make sure it is running.');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}
