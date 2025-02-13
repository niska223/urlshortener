import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlList, setUrlList] = useState([
   { id: 1, longUrl: 'https://example1.com', shortUrl: 'http://short.ly/abc123', clickCount: 5 },
   { id: 2, longUrl: 'https://example2.com', shortUrl: 'http://short.ly/xyz456', clickCount: 2 },
  ]);
  const [role, setRole] = useState('user'); // Change to 'admin' to see all URLs
  const navigate = useNavigate();

  const handleGenerateShortUrl = () => {
    // Logic for generating a short URL (this is a mockup for now)
    const generatedShortUrl = `http://short.ly/${Math.random().toString(36).substring(7)}`;
    setShortUrl(generatedShortUrl);
  };

  const handleLogout = () => {
    // Logic for logout (clear session or token, etc.)
    navigate('/login');
  };

  const filteredUrls = role === 'admin' ? urlList : urlList.filter(url => url.longUrl.startsWith('https://example'));

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>
      
      {/* URL Shortener Input Section */}
      <div style={styles.section}>
        <h3>URL Shortener</h3>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleGenerateShortUrl} style={styles.button}>Generate Short URL</button>
        {shortUrl && <p style={styles.shortUrl}>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>}
      </div>
      
      {/* URL Tracking Table */}
      <div style={styles.section}>
        <h3>URL Tracking</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Long URL</th>
              <th>Short URL</th>
              <th>Click Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredUrls.map(url => (
              <tr key={url.id}>
                <td>{url.longUrl}</td>
                <td><a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></td>
                <td>{url.clickCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    padding: '20px',
  },
  header: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  section: {
    width: '80%',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  shortUrl: {
    marginTop: '10px',
    color: '#333',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    padding: '10px',
  },
  tableRow: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  logoutButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Dashboard;
