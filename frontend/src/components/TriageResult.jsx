import React from 'react'
import './TriageResult.css'

const TriageResult = ({ result, onNewTicket }) => {
  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.85) return { label: 'High', class: 'high', icon: '🟢' }
    if (confidence >= 0.5) return { label: 'Medium', class: 'medium', icon: '🟡' }
    return { label: 'Low', class: 'low', icon: '🔴' }
  }

  const getActionInfo = (action) => {
    const actions = {
      'auto_resolve': {
        label: 'Auto-Resolve',
        class: 'auto-resolve',
        icon: '✅',
        description: 'High confidence - Can be automatically resolved'
      },
      'route_with_suggestion': {
        label: 'Route with Suggestion',
        class: 'route-suggestion',
        icon: '📤',
        description: 'Medium confidence - Route with AI suggestions'
      },
      'escalate_to_human': {
        label: 'Escalate to Human',
        class: 'escalate',
        icon: '👤',
        description: 'Low confidence - Requires manual review'
      }
    }
    return actions[action] || actions['escalate_to_human']
  }

  const confidenceInfo = getConfidenceLevel(result.confidence)
  const actionInfo = getActionInfo(result.routing_action)

  return (
    <div className="triage-result-container">
      <div className="result-header">
        <h2>✨ Triaging Complete</h2>
        <button className="new-ticket-btn" onClick={onNewTicket}>
          ➕ New Ticket
        </button>
      </div>

      <div className="result-content">
        {/* Queue Assignment */}
        <div className="result-section queue-section">
          <h3>📋 Queue Assignment</h3>
          <div className="queue-box">
            <span className="queue-icon">🎯</span>
            <span className="queue-name">{result.queue}</span>
          </div>
        </div>

        {/* Category & Sub-Category */}
        <div className="result-section category-section">
          <div className="category-item">
            <h4>Category</h4>
            <p className="category-value">{result.category}</p>
          </div>
          <div className="category-item">
            <h4>Sub-Category</h4>
            <p className="category-value">{result.sub_category}</p>
          </div>
        </div>

        {/* Confidence & Action */}
        <div className="result-section confidence-section">
          <div className="confidence-box">
            <h4>Confidence Score</h4>
            <div className={`confidence-bar ${confidenceInfo.class}`}>
              <div 
                className="confidence-fill" 
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
            <div className="confidence-details">
              <span className="confidence-icon">{confidenceInfo.icon}</span>
              <span className="confidence-percentage">
                {(result.confidence * 100).toFixed(1)}%
              </span>
              <span className="confidence-label">({confidenceInfo.label})</span>
            </div>
          </div>

          <div className={`action-box ${actionInfo.class}`}>
            <h4>Recommended Action</h4>
            <div className="action-content">
              <span className="action-icon">{actionInfo.icon}</span>
              <div className="action-text">
                <strong>{actionInfo.label}</strong>
                <p>{actionInfo.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Steps */}
        <div className="result-section steps-section">
          <h3>📝 Resolution Steps</h3>
          <ol className="resolution-steps">
            {result.resolution_steps.map((step, index) => (
              <li key={index} className="step-item">
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* SOP Reference */}
        <div className="result-section sop-section">
          <h4>📚 SOP Reference</h4>
          <p className="sop-reference">{result.sop_reference}</p>
        </div>

        {/* Reasoning */}
        <div className="result-section reasoning-section">
          <h4>💡 AI Reasoning</h4>
          <p className="reasoning-text">{result.reasoning}</p>
        </div>

        {/* Validation Errors (if any) */}
        {result.validation_errors && result.validation_errors.length > 0 && (
          <div className="result-section errors-section">
            <h4>⚠️ Validation Issues</h4>
            <ul className="validation-errors">
              {result.validation_errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="result-section metadata-section">
          <small className="timestamp">
            Triaged at: {new Date(result.timestamp).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  )
}

export default TriageResult
