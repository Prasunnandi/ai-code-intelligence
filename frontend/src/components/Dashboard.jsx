import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [githubToken, setGithubToken] = useState('');
  const [scans, setScans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    
    axios.get('http://localhost:5000/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setScans(res.data)).catch(console.error);
  }, [navigate]);

  const fetchRepos = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/github/repositories', {
        headers: { Authorization: `Bearer ${token}`, 'Github-Token': githubToken }
      });
      setRepos(res.data);
      localStorage.setItem('ghToken', githubToken);
    } catch(e) { alert('Error fetching repos'); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      
      <div>
        <h3>GitHub Integration</h3>
        <input placeholder="GitHub PAT Token" value={githubToken} onChange={e => setGithubToken(e.target.value)} />
        <button onClick={fetchRepos}>Fetch Repositories</button>
      </div>

      <div>
        <h3>Your Repositories</h3>
        <ul>
          {repos.map(r => (
            <li key={r.name}>
              <Link to={`/repo/${encodeURIComponent(r.full_name)}`}>{r.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Recent Scans</h3>
        <ul>
          {scans.map(s => (
            <li key={s._id}>
              {s.repo} - {s.path} (Findings: {s.findings?.length})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
