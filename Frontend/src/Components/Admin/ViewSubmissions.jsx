import React, { useEffect, useState } from "react";
import "./ViewSubmission.css";
import API from '../../api';

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {

        const response = await fetch(`${API}/home/allSubmissions/${username}`);
        if (!response.ok) throw new Error("Failed to fetch submissions");
        const data = await response.json();
        
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Error loading submissions");
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchSubmissions();
  }, [username]);

  const handleUpdateStatus = async (id, status, point) => {
    try {
      const res = await fetch("http://localhost:3000/submissions/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, point }),
      });

      if (res.ok) {
        alert(`Submission ${status}!`);
        setSubmissions((prev) =>
          prev.filter((sub) => sub._id !== id)
        );
      } else {
        alert("Error updating submission");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Server error while updating submission.");
    }
  };

  if (loading) return <p className="vs-loading">Loading submissions...</p>;
  if (error) return <p className="vs-error">{error}</p>;
  if (submissions.length === 0) return <p className="vs-empty">No pending submissions found.</p>;

  return (
    <div className="vs-container">
      <h2 className="vs-heading">Pending Submissions - Batch Review</h2>

      <div className="vs-grid">
        {submissions.map((sub) => (
          <div key={sub._id} className="vs-card">
            <h3>{sub.title}</h3>
            <p><strong>Description:</strong> {sub.desc}</p>
            <p><strong>Semester:</strong> {sub.sem}</p>
            <p><strong>Category:</strong> {sub.category}</p>
            <p><strong>Points:</strong> {sub.point}</p>
            <p><strong>Student ID:</strong> {sub.studentId}</p>
            <p><strong>Batch:</strong> {sub.batch}</p>
            <p><strong>Date:</strong> {new Date(sub.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {sub.status}</p>
            <p><strong>Proof:</strong> <a href={sub.proof} target="_blank" rel="noreferrer">View Proof</a></p>

            <div className="vs-actions">
              <button
                className="vs-approve-btn"
                onClick={() => handleUpdateStatus(sub._id, "approved", sub.point)}
              >
                ✅ Approve
              </button>
              <button
                className="vs-reject-btn"
                onClick={() => handleUpdateStatus(sub._id, "rejected", 0)}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSubmissions;
