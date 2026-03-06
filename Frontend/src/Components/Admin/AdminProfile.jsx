import React, { useEffect, useState } from "react";
import "./AdProfile.css";
import API from '../../api';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("No user logged in!");
      setLoading(false);
      return;
    }

    fetch(`${API}/getuserdata/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch admin data");
        return res.json();
      })
      .then((data) => {
        setAdminData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admin data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="admin-loading">Loading...</p>;
  if (!adminData) return <p className="admin-error">No admin data found.</p>;

  return (
    <div className="admin-profile-page">
      <header className="admin-profile-header">
        <h2>Admin Profile</h2>
        <p>Welcome, <strong>{adminData.name}</strong>!</p>
      </header>

      <main className="admin-profile-container">
        <section className="admin-info-section">
          <h3>Personal Information</h3>
          <div className="admin-info-grid">
            <div className="admin-info-item">
              <label>Full Name</label>
              <span>{adminData.name}</span>
            </div>
            <div className="admin-info-item">
              <label>Username</label>
              <span>{adminData.username}</span>
            </div>
            <div className="admin-info-item">
              <label>Email</label>
              <span>{adminData.email}</span>
            </div>
            <div className="admin-info-item">
              <label>Role</label>
              <span>{adminData.role}</span>
            </div>
          </div>
        </section>

        <section className="admin-info-section">
          <h3>Class Details</h3>
          <div className="admin-info-grid">
            <div className="admin-info-item full-width">
              <label>Class / Batch</label>
              <span>{adminData.batch}</span>
            </div>
          </div>
        </section>

        <div className="admin-profile-buttons">
          <button
            className="admin-btn admin-home-btn"
            onClick={() => (window.location.href = "/admin/home")}
          >
            Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
