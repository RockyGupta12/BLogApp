  const Footer = () => {
    const footerStyle = {
      backgroundColor: '#333',
      color: '#fff',
      textAlign: 'center',
      padding: '1em 0',
      position: 'fixed',
      bottom: 0,
      width: '100%',
    }
  
    return (
      <div style={footerStyle}>
        <br />
        <em>&copy; 2024 Your Blog. All rights reserved.</em>
      </div>
    )
}

export default Footer