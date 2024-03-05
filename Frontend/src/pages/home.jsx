import React from 'react';

const Home = () => {
  const homeStyle = {
    float: 'left',
    width: '70%',
    backgroundColor: '#fff',
    padding: '20px',
    margin: '20px 0',
    boxSizing: 'border-box',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px', // Optional: Add rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle shadow
  };

  // Placeholder image URL from Lorem Picsum
  const placeholderImageUrl = 'https://picsum.photos/800/400';

  return (
    <div style={homeStyle}>
      <h2>Welcome to Your Blog</h2>
      <p>This is a sample blog homepage. Customize it to suit your needs.</p>
      <img
        src={placeholderImageUrl}
        alt="Blog Background"
        style={imageStyle}
      />
    </div>
  );
};

export default Home;0