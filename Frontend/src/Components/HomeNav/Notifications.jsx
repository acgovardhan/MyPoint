import React, { useEffect, useState } from "react";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:3000/notifications/${username}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchNotifications();
  }, [username]);

  if (loading) return <p>Loading notifications...</p>;
  if (!notifications.length) return <p>No notifications.</p>;

  return (
    <div className="notif-container">
      {notifications.map((sub) => (
        <div key={sub._id} className="notif-item">
          {sub.status === "pending" 
            ? `Pending: ${sub.title} by ${sub.studentId}` 
            : `Your submission: ${sub.title} - ${sub.status}`}
          <span className="notif-date">
            {new Date(sub.date).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
