import React from 'react';

const Help = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 80%, #0f5132 100%)',
        color: '#e0ffe0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(30, 50, 30, 0.85)',
          border: '2px solid #1db954',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        <h1 style={{ color: '#1db954', marginBottom: '16px', fontWeight: 700 }}>
          Need Help?
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '24px' }}>
          <span role="img" aria-label="no-entry">
            
          </span>{' '}
          Sorry, <span style={{ color: '#1db954', fontWeight: 600 }}>no help will be provided</span>.
        </p>
        <button
          style={{
            background: '#1db954',
            color: '#111',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: 600,
            cursor: 'pointer',
          
          }}
          onClick={() => alert('Just kidding!')}
        >
          Try Anyway
        </button>
      </div>
    </div>
  );
};

export default Help;
