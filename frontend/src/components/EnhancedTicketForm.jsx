import { useState } from 'react'
import { triageTicket } from '../api/client'
import './EnhancedTicketForm.css'

const EnhancedTicketForm = ({ onTriageComplete, loading, setLoading }) => {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [verboseMode, setVerboseMode] = useState(false)
  const [maxIterations, setMaxIterations] = useState(10)
  const [templates, setTemplates] = useState([])
  const [showTemplates, setShowTemplates] = useState(false)

  const defaultTemplates = [
    {
      name: 'Access Issue',
      subject: 'Cannot access [RESOURCE]',
      description: 'I\'m unable to access [RESOURCE]. I keep getting [ERROR MESSAGE]. I\'ve tried [WHAT YOU\'VE TRIED]. This issue started [WHEN].'
    },
    {
      name: 'Hardware Problem',
      subject: '[DEVICE] not working',
      description: 'My [DEVICE] is not working properly. The problem: [ISSUE DESCRIPTION]. Error message: [ERROR]. I need this fixed urgently.'
    },
    {
      name: 'Software Issue',
      subject: '[APPLICATION] error',
      description: 'I\'m experiencing an error in [APPLICATION]. Steps to reproduce: 1. [STEP 1] 2. [STEP 2] 3. [STEP 3]. Error: [ERROR]. Version: [VERSION].'
    },
    {
      name: 'Network Issue',
      subject: 'Network connectivity problem',
      description: 'I\'m having network connectivity issues. Location: [LOCATION]. Connection type: [WIFI/ETHERNET]. Symptoms: [SYMPTOMS]. Other affected: [YES/NO].'
    },
    {
      name: 'General Issue',
      subject: 'Issue with [SERVICE]',
      description: 'I\'m having trouble with [SERVICE]. What I\'ve tried: [ATTEMPTS]. Current status: [STATUS]. Impact: [IMPACT].'
    }
  ]

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
        verbose: verboseMode,
        max_iterations: maxIterations
      })
      
      onTriageComplete(result)
      setSubject('')
      setDescription('')
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
      description: "Remote employee getting timeout error when connecting to company VPN. Tried resetting credentials and clearing cache. Issue started after system update yesterday."
    },
    {
      subject: "Password reset needed",
      description: "User account locked after multiple failed login attempts. Locked out since this morning. Tried account recovery email but didn't receive reset link."
    },
    {
      subject: "Printer not working",
      description: "Office printer shows error code E-001 and won't print. Connected devices show 'offline'. Network connectivity seems fine for other devices."
    }
  ]

  const loadExample = (example) => {
    setSubject(example.subject)
    setDescription(example.description)
    setError(null)
  }

  const loadTemplate = (template) => {
    setSubject(template.subject)
    setDescription(template.description)
    setShowTemplates(false)
  }

  const clearForm = () => {
    setSubject('')
    setDescription('')
    setError(null)
  }

  const saveDraft = () => {
    const draft = { subject, description, timestamp: new Date().toISOString() }
    localStorage.setItem('ticket_draft', JSON.stringify(draft))
    alert('Draft saved to browser!')
  }

  const loadDraft = () => {
    const draft = localStorage.getItem('ticket_draft')
    if (draft) {
      const { subject: s, description: d } = JSON.parse(draft)
      setSubject(s)
      setDescription(d)
    } else {
      alert('No draft found')
    }
  }

  const clearDraft = () => {
    localStorage.removeItem('ticket_draft')
    alert('Draft cleared')
  }

  return (
    <div className="enhanced-form-container">
      <h2>📝 Submit Ticket for Triaging</h2>
      
      <form onSubmit={handleSubmit} className="enhanced-form">
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

        {/* Advanced Options */}
        <div className="advanced-options">
          <button
            type="button"
            className="toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '▼ Advanced Options' : '▶ Advanced Options'}
          </button>

          {showAdvanced && (
            <div className="advanced-panel">
              <div className="option-group">
                <label>
                  <input
                    type="checkbox"
                    checked={verboseMode}
                    onChange={(e) => setVerboseMode(e.target.checked)}
                  />
                  Verbose Mode (shows detailed reasoning)
                </label>
              </div>

              <div className="option-group">
                <label htmlFor="maxIterations">
                  Max Iterations: <span className="value">{maxIterations}</span>
                </label>
                <input
                  type="range"
                  id="maxIterations"
                  min="1"
                  max="20"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="range-slider"
                />
                <small>Higher values = more thorough analysis (slower)</small>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-actions">
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

          <button 
            type="button" 
            className="secondary-button"
            onClick={clearForm}
            disabled={loading}
            title="Clear form"
          >
            🗑️ Clear
          </button>
        </div>

        <div className="draft-options">
          <button type="button" className="draft-btn" onClick={saveDraft} disabled={loading} title="Save current ticket as draft">
            💾 Save Draft
          </button>
          <button type="button" className="draft-btn" onClick={loadDraft} disabled={loading} title="Load last saved draft">
            📥 Load Draft
          </button>
          <button type="button" className="draft-btn" onClick={clearDraft} disabled={loading} title="Clear saved draft">
            ❌ Clear Draft
          </button>
        </div>
      </form>

      {/* Templates Section */}
      <div className="templates-section">
        <button 
          className="section-toggle"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          {showTemplates ? '▼ Ticket Templates' : '▶ Ticket Templates'}
        </button>

        {showTemplates && (
          <div className="templates-grid">
            {defaultTemplates.map((template, index) => (
              <div key={index} className="template-card" onClick={() => loadTemplate(template)}>
                <strong>{template.name}</strong>
                <p>{template.subject}</p>
                <span className="use-button">Use Template →</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Examples Section */}
      <div className="examples-section">
        <button 
          className="section-toggle"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          {showTemplates ? '▼ Example Tickets' : '▶ Example Tickets'}
        </button>

        {!showTemplates && (
          <div className="examples-grid">
            {exampleTickets.map((example, index) => (
              <div key={index} className="example-card" onClick={() => loadExample(example)}>
                <strong>{example.subject}</strong>
                <p>{example.description}</p>
                <span className="try-button">Try this →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedTicketForm
