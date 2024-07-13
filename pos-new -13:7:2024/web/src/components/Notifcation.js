import React from 'react';
import { useNotification } from './NotificationContext';
import '../Styles/NotificationComponent.css';

const NotificationComponent = () => {
  const { notifications } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
          <button className="close-button" onClick={() => removeNotification(notification.id)}>X</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
