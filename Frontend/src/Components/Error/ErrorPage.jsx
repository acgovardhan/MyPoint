import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error.css"

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1>404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <button onClick={() => navigate("/")} className="btn-home">
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
