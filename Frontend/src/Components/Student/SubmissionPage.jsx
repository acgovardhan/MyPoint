import React, { useState, useEffect } from "react";
import "./studentSubmission.css";
import API from '../../api';

const SubmissionPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    sem: "",
    category: "",
    point: "",
    proof: "",
  });

  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user data using username stored in localStorage
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Please log in again.");
      setLoadingUser(false);
      return;
    }

    fetch(`${API}/getuserdata/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoadingUser(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        alert("Error loading user info. Try logging in again.");
        setLoadingUser(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      alert("User data not loaded yet. Try again.");
      return;
    }

    const payload = {
      ...formData,
      username: userData.username,
      batch: userData.batch,
    };

    try {
      const response = await fetch("http://localhost:3000/activity_sub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Activity submitted successfully!");
        setFormData({
          title: "",
          desc: "",
          sem: "",
          category: "",
          point: "",
          proof: "",
        });
      } else {
        const errData = await response.json();
        alert(errData.message || "Error submitting form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  const SearchCat = () => {
    alert("Category search feature coming soon!");
  };

  if (loadingUser) return <p>Loading user data...</p>;

  return (
    <div className="submission-wrapper">
      <form id="activity-form" onSubmit={handleSubmit} className="activity-form">
        <h2 className="activity-title">Activity Submission</h2>
        <p className="activity-subtitle">
          Submitting as: <strong>{userData?.username}</strong> ({userData?.batch})
        </p>

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Workshop on Ethical Hacking"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="desc">Description:</label>
        <textarea
          id="desc"
          name="desc"
          placeholder="Describe your activity briefly..."
          value={formData.desc}
          onChange={handleChange}
          required
        />

        <fieldset>
          <legend>Semester and Category</legend>

          <label htmlFor="sem">Semester during which the activity was done:</label>
          <select
            id="sem"
            name="sem"
            value={formData.sem}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          <label htmlFor="category">Category:</label>
          <div className="category-selection">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="11a">11a</option>
              <option value="11">11</option>
              <option value="10">10</option>
              <option value="9">9</option>
              <option value="9a">9a</option>
              <option value="8">8</option>
              <option value="12">12</option>
            </select>
            <button type="button" onClick={SearchCat} className="category-btn">
              Find Category
            </button>
          </div>
        </fieldset>

        <label htmlFor="point">Points:</label>
        <input
          type="number"
          id="point"
          name="point"
          placeholder="e.g. 10"
          value={formData.point}
          onChange={handleChange}
          required
        />

        <fieldset>
          <legend>Proof of Activity</legend>
          <input
            type="text"
            id="proof-file"
            name="proof"
            placeholder="Enter proof drive link"
            value={formData.proof}
            onChange={handleChange}
          />
        </fieldset>

        <button type="submit" className="submit-btn">
          Submit Activity
        </button>
      </form>
    </div>
  );
};

export default SubmissionPage;
