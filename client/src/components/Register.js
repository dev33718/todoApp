import React, { useState } from 'react';
import './Register.css';

const Register = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          setMessage('Login email sent.');
          if (setLoggedIn) setLoggedIn(true);
        } else {
          setMessage('Registered successfully. Please check your email.');
        }
      } else {
        setMessage(data.message);
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