import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlList, setUrlList] = useState([
    { id: 1, longUrl: 'https://example1.com', shortUrl: `${window.location.origin}/short/abc123`, clickCount: 5 },
    { id: 2, longUrl: 'https://example2.com', shortUrl: `${window.location.origin}/short/xyz456`, clickCount: 2 },
  ]);

  // ✅ Checking authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); // 🔥 Redirecting if not logged in
    }
  }, [navigate]);

  const handleGenerateShortUrl = () => {
    if (!longUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const generatedShortUrl = `${window.location.origin}/short/${id}`;

    const newUrlEntry = {
      id,
      longUrl,
      shortUrl: generatedShortUrl,
      clickCount: 0
    };

    setUrlList((prevList) => [...prevList, newUrlEntry]);
    setShortUrl(generatedShortUrl);
    setLongUrl('');
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Removing user from localStorage
    navigate('/login'); // ✅ Redirecting to login page
  };

  const handleUrlClick = (shortUrl) => {
    setUrlList((prevList) =>
      prevList.map(url =>
        url.shortUrl === shortUrl ? { ...url, clickCount: url.clickCount + 1 } : url
      )
    );
    window.location.href = shortUrl;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>
      
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
        {shortUrl && (
          <p style={styles.shortUrl}>
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </p>
        )}
      </div>
      
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
            {urlList.map(url => (
              <tr key={url.id}>
                <td>{url.longUrl}</td>
                <td>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleUrlClick(url.shortUrl); }}>
                    {url.shortUrl}
                  </a>
                </td>
                <td>{url.clickCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
