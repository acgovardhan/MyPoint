import React from 'react';
import Navbar from '../HomeNav/Navbar';
import Notifications from '../HomeNav/Notifications';
import Logout from '../HomeNav/Logout';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'
import './Home.css'

const Home = ({ userRole }) => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Navbar>
        <div className="nav-left">
          <h2 className="logo">
            <FaHome></FaHome>
            <span> MyPoint</span>
          </h2>
        </div>
        <div className="nav-right">
          <button className='btn about-btn' onClick={()=> userRole === 'admin' ? navigate("/admin/home/profile") : navigate("/home/profile")}>Profile</button>
          <Logout />  
        </div>
      </Navbar>


      <main className="home-main">
        <div className="main-grid">
          <section className="home-content">
            <h1>Welcome, {userRole === 'admin' ? 'Admin' : 'Student'}!</h1>


            <div className="button-group">
            {userRole === 'student' ? (
              <>
                <button className="home-btn" onClick={() => navigate('/home/submission')}>
                ➕ Add Activity
                </button>
                <button className="home-btn" onClick={() => navigate('/home/allsubmissions')}>
                View My Submissions
                </button>
              </>
          ) : (
              <>
                <button className="home-btn" onClick={() => navigate('/admin/home/viewSubmission')}>
                View Class Submissions
                </button>
                <button className="home-btn" onClick={() => navigate('/admin/home/exportdata')}>
                Export Batch Data
                </button>
              </>
          )}
      </div>
      </section>


      <aside className="notifications-sidebar" aria-label="Notifications">
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="view-all-btn" onClick={() => navigate('/notifications')}>View all</button>
          </div>

          <div className="notifications-list">
          <Notifications />
          </div>
        </div>
      </aside>
      </div>
      </main>
    </div>
  );
};


export default Home;