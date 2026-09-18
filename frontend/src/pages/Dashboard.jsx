import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentEmail, setCurrentEmail] = useState('');
  const [totalEmails, setTotalEmails] = useState(0);
  const [processed, setProcessed] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    setLoading(true);
    setProgress(0);
    setProcessed(0);
    setTotalEmails(0);
    setCurrentEmail('');
    setResults([]);
    setStats(null);

    const formData = new FormData();
    formData.append('file', file);

    // Use fetch for SSE streaming
    fetch('http://localhost:5000/api/validate/bulk', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            setLoading(false);
            return;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.replace('data: ', ''));

                if (data.type === 'total') {
                  setTotalEmails(data.total);
                }

                if (data.type === 'progress') {
                  setProcessed(data.current);
                  setTotalEmails(data.total);
                  setCurrentEmail(data.currentEmail);
                  setProgress(Math.round((data.current / data.total) * 100));
                }

                if (data.type === 'done') {
                  const allResults = data.results;
                  setResults(allResults);

                  const valid = allResults.filter((r) => r.status === 'Valid').length;
                  const risky = allResults.filter((r) => r.status === 'Risky').length;
                  const invalid = allResults.filter((r) => r.status === 'Invalid').length;
                  const duplicate = allResults.filter((r) => r.status === 'Duplicate').length;
                  const typos = allResults.filter((r) => r.typoSuggestion !== 'None' && r.typoSuggestion !== '-').length;
                  const disposable = allResults.filter((r) => r.disposable === 'Yes').length;

                  setStats({
                    total: allResults.length,
                    valid,
                    risky,
                    invalid,
                    duplicate,
                    typos,
                    disposable,
                  });

                  setProgress(100);
                  setCurrentEmail('');
                  setLoading(false);
                  toast.success('Validation complete!');
                }
              } catch (e) {
                // skip parse errors
              }
            }
          });

          read();
        });
      };

      read();
    }).catch(() => {
      toast.error('Upload failed. Is the backend running?');
      setLoading(false);
    });
  };

  const handleDownload = () => {
    const cleaned = results.filter((r) => r.status === 'Valid');
    const csvContent =
      'Email,Status,Score,Format,MX,Disposable,TypoSuggestion,Reasons\n' +
      cleaned
        .map((r) =>
          `${r.email},${r.status},${r.score},${r.format},${r.mx},${r.disposable},${r.typoSuggestion},"${r.reasons}"`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_emails.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/report/download',
        { results, stats },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mailsense-report.pdf';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF report downloaded!');
    } catch (err) {
      toast.error('Failed to generate PDF report');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Valid') return 'badge-valid';
    if (status === 'Risky') return 'badge-risky';
    if (status === 'Duplicate') return 'badge-duplicate';
    return 'badge-invalid';
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />

      <h1 className="dashboard-heading">Dashboard</h1>
      <p className="dashboard-subheading">
        Upload a CSV file to validate and clean your email list
      </p>

      {/* Upload Box */}
      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file-input"
          id="csvFile"
        />
        <label htmlFor="csvFile" className="file-label">
          {file ? `📄 ${file.name}` : '📂 Choose CSV File'}
        </label>
        <button
          onClick={handleUpload}
          className="upload-btn"
          disabled={loading}
        >
          {loading ? 'Validating...' : 'Upload & Validate'}
        </button>
      </div>

      <p className="csv-hint">
        CSV must have a column named <strong>email</strong>,{' '}
        <strong>Email</strong>, or <strong>EMAIL</strong>
      </p>

      {/* Progress Bar */}
      {loading && (
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-title">Validating emails...</span>
            <span className="progress-count">
              {processed}/{totalEmails}
            </span>
          </div>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-percentage">{progress}%</div>
          {currentEmail && (
            <div className="progress-current">
              Processing: {currentEmail}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Emails</div>
          </div>
          <div className="stat-card stat-valid">
            <div className="stat-number">{stats.valid}</div>
            <div className="stat-label">Valid</div>
          </div>
          <div className="stat-card stat-risky">
            <div className="stat-number">{stats.risky}</div>
            <div className="stat-label">Risky</div>
          </div>
          <div className="stat-card stat-invalid">
            <div className="stat-number">{stats.invalid}</div>
            <div className="stat-label">Invalid</div>
          </div>
          <div className="stat-card stat-duplicate">
            <div className="stat-number">{stats.duplicate}</div>
            <div className="stat-label">Duplicates</div>
          </div>
          <div className="stat-card stat-typo">
            <div className="stat-number">{stats.typos}</div>
            <div className="stat-label">Typos Found</div>
          </div>
          <div className="stat-card stat-disposable">
            <div className="stat-number">{stats.disposable}</div>
            <div className="stat-label">Disposable</div>
          </div>
        </div>
      )}

      {/* Insights */}
      {stats && (
        <div className="insights-box">
          <h3 className="insights-heading">📊 Insights</h3>
          <ul className="insights-list">
            {stats.invalid > 0 && (
              <li>
                ❌ <strong>{stats.invalid}</strong> emails have invalid
                domains — remove them before sending
              </li>
            )}
            {stats.typos > 0 && (
              <li>
                💡 <strong>{stats.typos}</strong> emails have domain typos
                — review suggestions and recover lost contacts
              </li>
            )}
            {stats.disposable > 0 && (
              <li>
                🗑️ <strong>{stats.disposable}</strong> disposable emails
                detected — these will never convert
              </li>
            )}
            {stats.duplicate > 0 && (
              <li>
                📋 <strong>{stats.duplicate}</strong> duplicate entries
                removed from cleaned download
              </li>
            )}
            {stats.valid > 0 && (
              <li>
                ✅ <strong>{stats.valid}</strong> valid emails ready to use
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Download Buttons */}
      {results.length > 0 && (
        <div className="download-row">
          <button onClick={handleDownload} className="download-btn">
            ⬇️ Download Cleaned List (
            {results.filter((r) => r.status === 'Valid').length} emails)
          </button>
          <button onClick={handleDownloadPDF} className="download-pdf-btn">
            📄 Download PDF Report
          </button>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Score</th>
                <th>Format</th>
                <th>MX</th>
                <th>Disposable</th>
                <th>Typo Suggestion</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  <td>{row.email}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.score}</td>
                  <td>{row.format}</td>
                  <td>{row.mx}</td>
                  <td>{row.disposable}</td>
                  <td
                    className={
                      row.typoSuggestion !== 'None' &&
                      row.typoSuggestion !== '-'
                        ? 'typo-highlight'
                        : ''
                    }
                  >
                    {row.typoSuggestion}
                  </td>
                  <td>{row.reasons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;