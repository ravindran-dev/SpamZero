import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("message");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
        <h1>SpamZero</h1>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </header>

      {/* DETECTION NAV */}
      <nav className="detect-nav">
        <button
          className={activeTab === "message" ? "active" : ""}
          onClick={() => setActiveTab("message")}
        >
          Message Scan
        </button>
        <button
          className={activeTab === "inbox" ? "active" : ""}
          onClick={() => setActiveTab("inbox")}
        >
          Gmail Inbox Scan
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="content">
        {/* LEFT PANEL */}
        <div className="card">
          <h2>{activeTab === "message" ? "Scan Message" : "Scan Inbox"}</h2>

          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {activeTab === "message" && (
            <textarea
              placeholder="Paste message content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          <button
            className="primary-btn"
            disabled={
              loading || !email || (activeTab === "message" && !text)
            }
            onClick={activeTab === "message" ? scanMessage : scanInbox}
          >
            {loading ? "Scanning..." : "Scan Now"}
          </button>
        </div>

        {/* RIGHT PANEL – RESULTS */}
        <div className="card results">
          <h2>Results</h2>

          {!result && (
            <p className="muted">
              No scan performed yet. Run a scan to view results.
            </p>
          )}

          {result?.error && (
            <p className="error">{result.error}</p>
          )}

          {result && !result.error && (
            <>
              {/* SUMMARY */}
              <div className="result-summary">
                <p>
                  <strong>Scan Type:</strong>{" "}
                  {activeTab === "message"
                    ? "Single Message"
                    : "Gmail Inbox"}
                </p>
                <p>
                  <strong>Email:</strong> {result.email || email}
                </p>
                <p>
                  <strong>Scanned At:</strong>{" "}
                  {new Date().toLocaleString()}
                </p>
              </div>

              {/* PREDICTION */}
              {result.label && (
                <div
                  className={`prediction-badge ${
                    result.label === "SPAM" ? "spam" : "safe"
                  }`}
                >
                  Prediction Result: {result.label}
                </div>
              )}

              {/* SPAM COUNT (INBOX) */}
              {typeof result.spam_detected === "number" && (
                <p className="spam-count">
                  Spam Messages Detected:{" "}
                  <strong>{result.spam_detected}</strong>
                </p>
              )}

              {/* EMAIL STATUS */}
              <p className="email-status">
                A detailed scan report has been sent to the provided email
                address.
              </p>

              {/* SPAM DETAILS */}
              {Array.isArray(result.details) &&
              result.details.filter((m) => m.label === "SPAM").length >
                0 ? (
                <>
                  <h3>Detected Spam Messages</h3>
                  {result.details
                    .filter((m) => m.label === "SPAM")
                    .map((m, i) => (
                      <div key={i} className="spam-item">
                        <p>
                          <strong>From:</strong> {m.from}
                        </p>
                        <p className="message-text">
                          {m.message}
                        </p>
                      </div>
                    ))}
                </>
              ) : (
                <p className="muted">
                  No spam messages were detected in this scan.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
