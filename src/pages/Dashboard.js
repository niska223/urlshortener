import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, [navigate]);

  const fetchUserUrls = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/user/urls?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch URLs");
      const data = await response.json();
      if (data.success) setUrls(data.urls);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserUrls();
  }, [fetchUserUrls]);

  const createShortUrl = async () => {
    if (!longUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, user_id: userId }),
      });

      const data = await response.json();
      if (data.success) {
        setShortUrl(data.shortUrl);
        setUrls([...urls, { id: data.id, longUrl: data.longUrl, shortUrl: data.shortUrl, clickCount: data.clickCount, created_at: data.created_at }]);
        setLongUrl("");
      } else {
        alert("Failed to generate short URL. Please try again.");
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <div style={styles.section}>
        <h3>URL Shortener</h3>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={styles.input}
        />
        <button onClick={createShortUrl} style={styles.button}>Generate Short URL</button>
        {shortUrl && (
          <p style={styles.shortUrl}>
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </p>
        )}
      </div>
      <div style={styles.section}>
        <h3>URL Tracking</h3>
        {loading ? (
          <p>Loading URLs...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Long URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {urls.length > 0 ? (
                urls.map((url) => (
                  <tr key={url.id}>
                    <td>{url.id}</td>
                    <td><a href={url.longUrl} target="_blank" rel="noopener noreferrer">{url.longUrl}</a></td>
                    <td><a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></td>
                    <td>{url.clickCount || 0}</td>
                    <td>{new Date(url.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No URL history found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" },
  section: { marginBottom: "20px" },
  input: { padding: "10px", width: "80%" },
  button: { marginLeft: "10px", padding: "10px", cursor: "pointer" },
  shortUrl: { marginTop: "10px", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", backgroundColor: "#fff" },
  logoutButton: { backgroundColor: "red", padding: "10px", color: "white", cursor: "pointer" },
};

export default Dashboard;
