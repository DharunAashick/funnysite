import { useState, useEffect } from 'react'
import './App.css'
import { API_ENDPOINTS } from './config'

function Admin() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.getNames);
      if (response.ok) {
        const data = await response.json();
        setNames(data.names);
      } else {
        setError('Failed to fetch names');
      }
    } catch (err) {
      setError('Server is not running. Please start the backend server.');
      console.error('Error fetching names:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNames();
  }, []);

  const downloadAsTextFile = () => {
    const text = names.map((entry) => 
      `${entry.id}. ${entry.name} - ${entry.date}`
    ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `valentine-names-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllNames = async () => {
    if (window.confirm('Are you sure you want to clear all names?')) {
      try {
        const response = await fetch(API_ENDPOINTS.clearNames, {
          method: 'DELETE',
        });
        if (response.ok) {
          setNames([]);
          alert('All names cleared successfully!');
        }
      } catch (err) {
        alert('Error clearing names. Make sure the server is running.');
        console.error('Error clearing names:', err);
      }
    }
  };

  const copyToClipboard = () => {
    const text = names.map((entry) => 
      `${entry.id}. ${entry.name} - ${entry.date}`
    ).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Names copied to clipboard!');
    });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px' }}>
        <h1 className="title">Admin Panel 🔐</h1>
        
        {loading ? (
          <p className="subtext">Loading names...</p>
        ) : error ? (
          <div>
            <p className="subtext" style={{ color: '#d63031' }}>{error}</p>
            <button onClick={fetchNames} className="btn no-btn" style={{ marginTop: '10px' }}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <p className="subtext">Total names collected: {names.length}</p>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={fetchNames} className="btn no-btn">
                🔄 Refresh
              </button>
              <button onClick={downloadAsTextFile} className="btn no-btn">
                📥 Download as Text File
              </button>
              <button onClick={copyToClipboard} className="btn no-btn">
                📋 Copy to Clipboard
              </button>
              <button onClick={clearAllNames} className="btn yes-btn" style={{ position: 'relative' }}>
                🗑️ Clear All
              </button>
            </div>

            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto', 
              textAlign: 'left',
              background: 'rgba(255,255,255,0.6)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              {names.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#636e72' }}>No names collected yet.</p>
              ) : (
                <ol>
                  {names.map((entry) => (
                    <li key={entry.id} style={{ marginBottom: '10px', color: '#2d3436' }}>
                      <strong>{entry.name}</strong>
                      <br />
                      <small style={{ color: '#636e72' }}>{entry.date}</small>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}

        <div style={{ marginTop: '20px' }}>
          <a href="/" className="btn no-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Main Page
          </a>
        </div>
      </div>
    </div>
  )
}

export default Admin
