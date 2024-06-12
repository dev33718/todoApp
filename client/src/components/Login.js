import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset the message state
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); // Parsing JSON here regardless of response status

      if (response.ok) {
        console.log('Login Response Data:', data); // Log the response data
        if (data.token) {
          localStorage.setItem('token', data.token); // Store token in localStorage
          setMessage('Login successful');
          history.push('/dashboard'); // Redirect to dashboard after successful login
        } else {
          setMessage('Token not received');
        }
      } else {
        setMessage(`Error: ${data.message}`); // Handling error message from backend
      }
    } catch (error) {
      console.error('Catch error:', error); // Log the actual error
      setMessage('Error sending email');
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
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;