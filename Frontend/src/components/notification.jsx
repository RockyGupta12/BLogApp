const Notification = ({ message }) => {
  const notificationStyle = {
      backgroundColor: '#ff6666',
      color: '#fff',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',
  };

  if (message === null) {
      return null;
  }

  return (
      <div style={notificationStyle}>
          {message}
      </div>
  );
};

export default Notification;