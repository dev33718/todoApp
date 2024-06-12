// Dashboard component

import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ListTodo from './ListTodos'; // Import the ListTodo component
import InputTodo from './InputTodo'; // Import the InputTodo component
import Logout from './Logout'; // Import the Logout component

const ValidateToken = ({ children }) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      fetch(`http://localhost:5000/api/auth/validate?token=${token}`)
        .then(response => {
          if (response.ok) {
            setIsValid(true);
          } else {
            setError('Invalid token');
          }
        })
        .catch(() => {
          setError('Error validating token');
        });
    } else {
      setError('No token provided');
    }
  }, [location.search]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!isValid) {
    return <div>Loading...</div>;
  }

  return children; // Render children if token is valid
};

const Dashboard = () => {
  const history = useHistory();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        localStorage.removeItem('token'); // Clear token from localStorage
        history.push('/'); // Redirect to login page
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <ValidateToken>
      <div>
        <Logout onLogout={handleLogout} /> {/* Pass the logout function as a prop */}
        <InputTodo />
        <ListTodo />
      </div>
    </ValidateToken>
  );
};

export default Dashboard;