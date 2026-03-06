import React, { useEffect, useState } from "react";
import "./MySubmissions.css";
import API from '../../api';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("No username found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API}/home/viewSubmissions/${username}`);
        if (!response.ok) throw new Error("Failed to fetch submissions");

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <p className="loading-text">Loading your submissions...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="mysub-container">
      <h2 className="mysub-heading">My Submitted Activities</h2>

      {submissions.length === 0 ? (
        <p className="no-submissions">You haven’t submitted any activities yet.</p>
      ) : (
        <div className="mysub-list">
          {submissions.map((sub, index) => (
            <div className="mysub-card" key={index}>
              <h3>{sub.title}</h3>
              <p><strong>Description:</strong> {sub.desc}</p>
              <p><strong>Semester:</strong> {sub.sem}</p>
              <p><strong>Category:</strong> {sub.category}</p>
              <p><strong>Points:</strong> {sub.point}</p>
              <p><strong>Batch:</strong> {sub.batch}</p>
              <p><strong>Status:</strong> 
                <span className={`status ${sub.status}`}>{sub.status}</span>
              </p>
              {sub.proof && (
                <p>
                  <strong>Proof:</strong>{" "}
                  <a href={sub.proof} target="_blank" rel="noopener noreferrer">
                    View Proof
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
