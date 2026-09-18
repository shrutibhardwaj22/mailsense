import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

function Home() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValidate = async () => {
    if (!email) {
      toast.error('Please enter an email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/validate/single', { email });
      setResult(res.data);
    } catch (err) {
      toast.error('Validation failed. Is the backend running?');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === 'Valid') return 'badge-valid';
    if (status === 'Risky') return 'badge-risky';
    return 'badge-invalid';
  };

  return (
    <div className="home-container">
      <ToastContainer />

      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-heading">
          Validate & Clean Your Email List
        </h1>
        <p className="hero-subheading">
          Catch typos, detect disposable emails, verify domains — built for Indian businesses
        </p>

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter email to validate..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          />
          <button
            onClick={handleValidate}
            className="validate-btn"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Validate'}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="result-card">
            <div className="result-header">
              <span className="result-email">{result.email}</span>
              <span className={`status-badge ${getStatusColor(result.score.status)}`}>
                {result.score.status}
              </span>
            </div>

            <div className="score-row">
              <span className="score-label">Trust Score</span>
              <span className="score-value">{result.score.score}/100</span>
            </div>

            <div className="checks">
              <div className="check-item">
                <span>{result.format.valid ? '✅' : '❌'}</span>
                <span>Format — {result.format.reason}</span>
              </div>
              <div className="check-item">
                <span>{result.mx.valid ? '✅' : '❌'}</span>
                <span>MX Record — {result.mx.reason}</span>
              </div>
              <div className="check-item">
                <span>{result.disposable.disposable ? '⚠️' : '✅'}</span>
                <span>Disposable — {result.disposable.reason}</span>
              </div>
              {result.typo.hasTypo && (
                <div className="check-item">
                  <span>💡</span>
                  <span>Typo detected — Did you mean <strong>{result.typo.suggestion}</strong>?</span>
                </div>
              )}
            </div>

            {result.score.reasons.length > 0 && (
              <div className="reasons-box">
                <strong>Issues found:</strong>
                <ul>
                  {result.score.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features">
        <h2 className="features-heading">Why MailSense?</h2>
        <div className="feature-grid">
          {[
            { icon: '🔍', title: 'Typo Correction', desc: 'Detects and suggests fixes for misspelled domains like gamil.com → gmail.com' },
            { icon: '📡', title: 'MX Record Check', desc: 'Verifies the domain actually has mail servers configured' },
            { icon: '🗑️', title: 'Disposable Detection', desc: 'Flags temporary emails from mailinator, tempmail, and 30+ providers' },
            { icon: '📂', title: 'Bulk CSV Upload', desc: 'Upload thousands of emails and download a cleaned list instantly' },
            { icon: '💰', title: 'India Pricing', desc: 'Plans starting at ₹499/month. Pay via UPI, no USD card needed' },
            { icon: '⚡', title: 'REST API', desc: 'Integrate real-time validation directly into your sign-up forms' },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta">
        <h2 className="cta-heading">Ready to clean your list?</h2>
        <p className="cta-subtext">Upload a CSV and get results in seconds</p>
        <button onClick={() => navigate('/dashboard')} className="cta-btn">
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default Home;