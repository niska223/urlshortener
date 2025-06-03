import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, role } = formData;

    if (!username.trim()) return alert('Username is required!');
    if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(email)) return alert('Please enter a valid Gmail address.');
    if (password.length < 8) return alert('Password must be at least 8 characters long.');
    if (password !== confirmPassword) return alert("Passwords don't match!");

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong! Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} style={styles.input} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={styles.input} />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} style={styles.input} />
      <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSignup} style={styles.button}>Sign Up</button>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial' },
  input: { padding: '10px', fontSize: '16px', margin: '10px 0', width: '300px', borderRadius: '5px', border: '1px solid #ddd' },
  select: { padding: '10px', fontSize: '16px', margin: '10px 0', width: '320px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: '#fff' },
  button: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '320px' }
};

export default Signup;
