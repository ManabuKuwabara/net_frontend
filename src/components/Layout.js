import React from 'react';

const Layout = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </div>
  );
};

export default Layout;