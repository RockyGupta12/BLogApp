import React from 'react';

const Home = () => {
  const homeStyle = {
    float: 'left',
    width: '100%', // Increase the width for a bigger appearance
    backgroundColor: '#fff',
    padding: '30px', // Increase padding for spacing
    margin: '20px auto', // Center the container horizontally
    boxSizing: 'border-box',
    fontSize: '18px', // Increase font size for text
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

export default Home;
