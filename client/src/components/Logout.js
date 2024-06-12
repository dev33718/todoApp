import React from 'react';

const Logout = ({ onLogout }) => {
  const handleLogout = async () => {
    await onLogout();
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;