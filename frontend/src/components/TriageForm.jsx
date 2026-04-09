import { useState } from 'react'
import { triageTicket } from '../api/client'
import './TriageForm.css'

const TriageForm = ({ onTriageComplete, loading, setLoading }) => {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!subject.trim()) {
      setError('Subject is required')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const result = await triageTicket({
        subject: subject.trim(),
        description: description.trim(),
        verbose: false,
        max_iterations: 10
      })
      
      onTriageComplete(result)
    } catch (err) {
      setError(err.response?.data?.detail?.message || 'Failed to triage ticket. Please try again.')
      console.error('Triage error:', err)
    } finally {
      setLoading(false)
    }
  }

  const exampleTickets = [
    {
      subject: "Cannot access VPN",
      description: "Remote employee getting timeout error when connecting to company VPN"
    },
    {
      subject: "Password reset needed",
      description: "User account locked after multiple failed login attempts"
    },
    {
      subject: "Printer not working",
      description: "Office printer shows error code E-001 and won't print"
    }
  ]

  const loadExample = (example) => {
    setSubject(example.subject)
    setDescription(example.description)
    setError(null)
  }

  return (
    <div className="triage-form-container">
      <h2>📝 Submit Ticket for Triaging</h2>
      
      <form onSubmit={handleSubmit} className="triage-form">
        <div className="form-group">
          <label htmlFor="subject">
            Subject <span className="required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of the issue"
            className="form-input"
            disabled={loading}
            maxLength={500}
          />
          <span className="char-count">{subject.length}/500</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="optional">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the problem, error messages, steps to reproduce, etc."
            className="form-textarea"
            rows={6}
            disabled={loading}
            maxLength={5000}
          />
          <span className="char-count">{description.length}/5000</span>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !subject.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Triaging... Please wait
            </>
          ) : (
            <>
              🎯 Triage Ticket
            </>
          )}
        </button>
      </form>

      <div className="examples-section">
        <h3>📋 Try Example Tickets</h3>
        <div className="examples-grid">
          {exampleTickets.map((example, index) => (
            <div key={index} className="example-card" onClick={() => loadExample(example)}>
              <strong>{example.subject}</strong>
              <p>{example.description}</p>
              <span className="try-button">Try this →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TriageForm
