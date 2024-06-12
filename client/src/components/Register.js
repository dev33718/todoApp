import React, { useState } from 'react';
import './Register.css'; // Import your CSS file for styling

const Register = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setLoggedIn(true);
          setMessage(''); // Reset the error message
        } else {
          setMessage('Invalid email or not registered');
        }
      } else {
        // Register logic
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setMessage('Registered successfully. Please log in.');
        } else if (response.status === 400) {
          setMessage('User already registered. Please log in.');
        } else {
          setMessage('Error sending email');
        }
      }
    } catch (error) {
      setMessage('Error sending email');
    }
  };  

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p className="message">{message}</p>
      <p className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default Register;