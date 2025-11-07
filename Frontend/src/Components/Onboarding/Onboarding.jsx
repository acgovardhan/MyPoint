import React from 'react'
import { useState } from 'react';
import OnboardingImg from '../../assets/onbaord.png'
import { Link } from 'react-router-dom';
import './Onboarding.css'

const Onboarding = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="onboard-wrapper">

      <nav className="navbar">
        <div className="nav-logo">MyPoint</div>
       
        <div className="nav-actions">
          <Link to={"/about"} className='btn about-btn'>Why MyPoint?</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>Track. Manage. Earn Activity Points.</h1>
          <p>
            Simplify how students and institutions record, verify, and manage
            academic activity points, all in one place.
          </p>
          <div className="hero-buttons">
            <Link to={"/signup"} className='btn primary-btn'>Sign Up Free</Link>
            <Link to={"/login"} className='btn secondary-btn'>Log In</Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={OnboardingImg}
            alt="Activity illustration"
          />
        </div>
      </section>
    </div>
  )
}

export default Onboarding
