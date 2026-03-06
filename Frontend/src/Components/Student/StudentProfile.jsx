import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studentprofile.css';
import API from '../../api';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username'); // get from localStorage
    if (!username) {
      navigate('/login');
      return;
    }

    fetch(`${API}/getuserdata/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => {
        setStudentData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!studentData) return <p>No user data found</p>;

  // Calculate progress bar width (max 100 points)
  const points = studentData.points || 0;
  const progress = Math.min((points / 100) * 100, 100);

  return (
    <div className="sp-app">
      <header className="sp-header">
        <h1>Profile</h1>
        <p>Hello, <strong>{studentData.name}</strong>! Welcome back.</p>
      </header>

      <main className="sp-main">
        <section className="sp-card">
          <h2>Personal Details</h2>
          <div className="sp-grid">
            <div className="sp-item">
              <label>Full Name</label>
              <span>{studentData.name}</span>
            </div>
            <div className="sp-item">
              <label>Username</label>
              <span>{studentData.username}</span>
            </div>
            <div className="sp-item">
              <label>Email</label>
              <span>{studentData.email}</span>
            </div>
            <div className="sp-item">
              <label>Role</label>
              <span>{studentData.role}</span>
            </div>
            <div className="sp-item">
              <label>Dept. & Year of Passout</label>
              <span>{studentData.batch}</span>
            </div>
          </div>
        </section>

        <section className="sp-card">
          <h2>Academic Details</h2>
          <div className="sp-grid">
            <div className="sp-item-full">
              <label>Points</label>
              <span>{points}</span>
              <div className="sp-points-container">
                <div className="sp-progress-bar">
                  <div
                    className="sp-progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="sp-btn-container">
            <button className="sp-btn" onClick={() => navigate('/home')}>
              Home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentProfile;
