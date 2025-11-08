import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        // Remove username from localStorage
        localStorage.removeItem("username");

        alert("Logged out successfully!");
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.message || "Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Server error while logging out");
    }
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
