import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Register.css';

const Register = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotentKey = uuidv4();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, idempotentKey }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          if (data.message === 'Login email sent') {
            setMessage('Login email sent.');
            if (setLoggedIn) setLoggedIn(true);
          } else if (data.message === 'Login email already sent. Please check your email.') {
            setMessage('Login email already sent. Please check your email.');
          }
        } else {
          setMessage('Registered successfully. Please check your email.');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error sending email');
    } finally {
      setIsSubmitting(false);
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
        <button type="submit" className="btn" disabled={isSubmitting}>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p className="message">{message}</p>
      <p className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default Register;