import React from 'react'
import './ResultCard.css'

const ResultCard = ({ result, onRemove, onRefresh, compact = false }) => {
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
        icon: '✅'
      },
      'route_with_suggestion': {
        label: 'Route with Suggestion',
        class: 'route-suggestion',
        icon: '📤'
      },
      'escalate_to_human': {
        label: 'Escalate to Human',
        class: 'escalate',
        icon: '👤'
      }
    }
    return actions[action] || actions['escalate_to_human']
  }

  const confidenceInfo = getConfidenceLevel(result.confidence)
  const actionInfo = getActionInfo(result.routing_action)
  const timestamp = new Date(result.timestamp)

  if (compact) {
    return (
      <div className="result-card compact">
        <div className="card-header">
          <div className="card-title">
            <span className={`confidence-badge ${confidenceInfo.class}`}>
              {confidenceInfo.icon} {(result.confidence * 100).toFixed(0)}%
            </span>
            <span className="queue-badge">{result.queue}</span>
          </div>
          <span className="timestamp">{timestamp.toLocaleString()}</span>
        </div>

        <div className="card-body">
          <div className="category-line">
            <strong>{result.category}</strong> → {result.sub_category}
          </div>
          <div className="action-line">
            <span className={`action-badge ${actionInfo.class}`}>
              {actionInfo.icon} {actionInfo.label}
            </span>
          </div>
        </div>

        {onRemove && (
          <button className="remove-btn" onClick={() => onRemove(result.id)} title="Remove">
            ✕
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="result-card">
      <div className="card-header">
        <h3>✨ Triage Result</h3>
        <div className="card-actions">
          {onRefresh && (
            <button className="action-btn" onClick={onRefresh} title="Refresh">
              🔄
            </button>
          )}
          {onRemove && (
            <button className="action-btn remove" onClick={() => onRemove(result.id)} title="Remove">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        {/* Queue Assignment */}
        <div className="result-section queue-section">
          <h4>📋 Queue Assignment</h4>
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
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Steps */}
        {result.resolution_steps && result.resolution_steps.length > 0 && (
          <div className="result-section steps-section">
            <h4>📝 Resolution Steps</h4>
            <ol className="resolution-steps">
              {result.resolution_steps.map((step, index) => (
                <li key={index} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Timestamp */}
        <div className="result-section metadata-section">
          <small className="timestamp">
            Triaged at: {timestamp.toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
