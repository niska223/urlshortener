import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/urls');
        if (!response.ok) throw new Error('Failed to fetch URLs');
        const data = await response.json();
        if (data.success) setUrls(data.urls);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! You have full access to the system.</p>
      <div style={styles.tableContainer}>
        {loading ? (
          <p>Loading URLs...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Long URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {urls.length > 0 ? (
                urls.map((url) => (
                  <tr key={url.id}>
                    <td>{url.id}</td>
                    <td>{url.user_id}</td>
                    <td>
                      <a href={url.longUrl} target="_blank" rel="noopener noreferrer">
                        {url.longUrl}
                      </a>
                    </td>
                    <td>
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                        {url.shortUrl}
                      </a>
                    </td>
                    <td>{url.clickCount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No URLs found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8d7da',
    minHeight: '100vh',
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AdminDashboard;
