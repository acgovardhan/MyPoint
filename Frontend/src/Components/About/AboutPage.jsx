import React from 'react'
import AboutImg from '../../assets/aboutImg.png'
import { useNavigate } from 'react-router-dom'
import "./About.css"

const AboutPage = () => {
  const navigate = useNavigate()
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About MyPoint</h1>
        <p>
          Streamlining student activity point management for a smarter academic experience.
        </p>
      </header>

      <section className="about-content">
        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            MyPoint aims to simplify how students and institutions record,
            manage, and verify activity points. We help students focus on what
            truly matters — skill-building and growth — while ensuring universities
            have accurate, transparent, and secure data management.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li>✅ Seamless activity point submission and tracking</li>
            <li>✅ Admin and faculty verification tools</li>
            <li>✅ Instant notifications and progress insights</li>
            <li>✅ Secure digital records for each student</li>
          </ul>

          <h2>Our Vision</h2>
          <p>
            To empower every student to take charge of their extracurricular
            achievements, and every institution to manage them effortlessly.
          </p>
        </div>

        <div className="about-image">
          <img
            src={AboutImg}
            alt="About ActivityPoint"
          />
        </div>
      </section>
      <button onClick={() => navigate("/")} className='btn-home'>Go Back</button>
    </div>
  )
}

export default AboutPage
