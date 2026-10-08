import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Repository() {
  const { repoName } = useParams();
  const [files, setFiles] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ghToken = localStorage.getItem('ghToken');
    
    axios.get(`http://localhost:5000/api/github/files?repo=${encodeURIComponent(repoName)}`, {
      headers: { Authorization: `Bearer ${token}`, 'Github-Token': ghToken }
    }).then(res => setFiles(res.data)).catch(console.error);
  }, [repoName]);

  const scanFile = async (path) => {
    const token = localStorage.getItem('token');
    const ghToken = localStorage.getItem('ghToken');
    setScanResult({ loading: true });
    
    try {
      const res = await axios.post('http://localhost:5000/api/scans', {
        repo: repoName,
        path: path
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Github-Token': ghToken }
      });
      setScanResult(res.data);
    } catch(e) {
      setScanResult({ error: 'Scan failed' });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Repository: {repoName}</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Files</h3>
          <ul>
            {files.map(f => (
              <li key={f}>
                {f} <button onClick={() => scanFile(f)}>Scan</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Scan Results</h3>
          {scanResult?.loading && <p>Scanning...</p>}
          {scanResult?.error && <p>{scanResult.error}</p>}
          {scanResult?.findings && (
            <div>
              <h4>Static Findings:</h4>
              <pre>{JSON.stringify(scanResult.findings, null, 2)}</pre>
              <h4>AI Review:</h4>
              <pre>{JSON.stringify(scanResult.ai_review, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
