import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setMessage('');

    const idempotentKey = uuidv4();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, idempotentKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login email sent.');
        setTimeout(() => history.push('/dashboard'), 2000);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error sending link');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoggingIn}
        />
        <button type="submit" disabled={isLoggingIn}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;