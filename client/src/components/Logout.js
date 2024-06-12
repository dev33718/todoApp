// Logout component

import React from 'react';

const Logout = ({ onLogout }) => {
  const handleLogout = async () => {
    await onLogout(); // Call the logout function passed as a prop
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;