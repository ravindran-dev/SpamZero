import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("message");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const scanMessage = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        email,
        text,
      });
      setResult(res.data);
    } catch {
      setResult({ error: "Prediction failed." });
    }
    setLoading(false);
  };

  const scanInbox = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:5000/scan-inbox", {
        email,
      });
      setResult(res.data);
    } catch {
      setResult({ error: "Inbox scan failed." });
    }
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      {/* HEADER */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon"><i className="fas fa-shield-alt"></i></div>
            <div className="logo-text">
              <h1>SpamZero</h1>
              <p className="tagline">Advanced Email Security</p>
            </div>
          </div>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="hero-section">
        <h2 className="hero-title">Protect Your Inbox from Spam</h2>
        <p className="hero-subtitle">AI-powered spam detection to keep your email safe and clean</p>
      </div>

      {/* DETECTION NAV */}
      <nav className="detect-nav">
        <button
          className={activeTab === "message" ? "active" : ""}
          onClick={() => setActiveTab("message")}
        >
          <span className="nav-icon"><i className="fas fa-envelope"></i></span>
          <span className="nav-text">
            <strong>Message Scan</strong>
            <small>Analyze individual messages</small>
          </span>
        </button>
        <button
          className={activeTab === "inbox" ? "active" : ""}
          onClick={() => setActiveTab("inbox")}
        >
          <span className="nav-icon"><i className="fas fa-inbox"></i></span>
          <span className="nav-text">
            <strong>Inbox Scan</strong>
            <small>Full Gmail inbox analysis</small>
          </span>
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="content">
        {/* LEFT PANEL */}
        <div className="card scan-card">
          <div className="card-header">
            <h2>
              <span className="header-icon">{activeTab === "message" ? <i className="fas fa-file-alt"></i> : <i className="fas fa-inbox"></i>}</span>
              {activeTab === "message" ? "Scan Message" : "Scan Inbox"}
            </h2>
            <p className="card-description">
              {activeTab === "message" 
                ? "Enter your email and paste the message content to check for spam"
                : "Connect your Gmail account to scan your entire inbox for spam"}
            </p>
          </div>

          <div className="input-group">
            <label htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {activeTab === "message" && (
            <div className="input-group">
              <label htmlFor="message-input">Message Content</label>
              <textarea
                id="message-input"
                placeholder="Paste the email message content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}

          <button
            className="primary-btn"
            disabled={
              loading || !email || (activeTab === "message" && !text)
            }
            onClick={activeTab === "message" ? scanMessage : scanInbox}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Scanning...
              </>
            ) : (
              <>
                <span className="btn-icon"><i className="fas fa-search"></i></span>
                Scan Now
              </>
            )}
          </button>
        </div>

        {/* RIGHT PANEL – RESULTS */}
        <div className="card results-card">
          <div className="card-header">
            <h2>
              <span className="header-icon"><i className="fas fa-chart-line"></i></span>
              Scan Results
            </h2>
          </div>

          {!result && (
            <div className="empty-state">
              <div className="empty-icon"><i className="fas fa-search"></i></div>
              <h3>No Results Yet</h3>
              <p>Run a scan to see detailed analysis and results</p>
            </div>
          )}

          {result?.error && (
            <div className="error-state">
              <span className="error-icon"><i className="fas fa-exclamation-triangle"></i></span>
              <p>{result.error}</p>
            </div>
          )}

          {result && !result.error && (
            <>
              {/* SUMMARY */}
              <div className="result-summary">
                <div className="summary-item">
                  <span className="summary-label">Scan Type</span>
                  <span className="summary-value">
                    {activeTab === "message" ? "Single Message" : "Gmail Inbox"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{result.email || email}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Scanned At</span>
                  <span className="summary-value">{new Date().toLocaleString()}</span>
                </div>
              </div>

              {/* PREDICTION */}
              {result.label && (
                <div
                  className={`prediction-badge ${
                    result.label === "SPAM" ? "spam" : "safe"
                  }`}
                >
                  <span className="badge-icon">
                    {result.label === "SPAM" ? <i className="fas fa-ban"></i> : <i className="fas fa-check-circle"></i>}
                  </span>
                  <div className="badge-content">
                    <span className="badge-label">Status</span>
                    <span className="badge-result">{result.label}</span>
                  </div>
                </div>
              )}

              {/* SPAM COUNT (INBOX) */}
              {typeof result.spam_detected === "number" && (
                <div className="spam-count">
                  <span className="count-icon"><i className="fas fa-chart-bar"></i></span>
                  <div className="count-content">
                    <span className="count-label">Spam Detected</span>
                    <span className="count-value">{result.spam_detected}</span>
                  </div>
                </div>
              )}

              {/* EMAIL STATUS */}
              <div className="email-status">
                <span className="status-icon"><i className="fas fa-paper-plane"></i></span>
                <p>A detailed scan report has been sent to your email address</p>
              </div>

              {/* SPAM DETAILS */}
              {Array.isArray(result.details) &&
              result.details.filter((m) => m.label === "SPAM").length > 0 ? (
                <div className="spam-details-section">
                  <h3>
                    <span className="section-icon"><i className="fas fa-exclamation-circle"></i></span>
                    Detected Spam Messages
                  </h3>
                  {result.details
                    .filter((m) => m.label === "SPAM")
                    .map((m, i) => (
                      <div key={i} className="spam-item">
                        <div className="spam-header">
                          <span className="spam-badge">Spam</span>
                          <span className="spam-from">{m.from}</span>
                        </div>
                        <div className="message-text">
                          {m.message}
                        </div>
                      </div>
                    ))}
                </div>
              ) : result.details ? (
                <div className="success-message">
                  <span className="success-icon"><i className="fas fa-check-circle"></i></span>
                  <p>Great news! No spam messages were detected in this scan.</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
