import React from 'react'
import './HealthStatus.css'

const HealthStatus = ({ health, stats }) => {
  if (!health) {
    return (
      <div className="health-status loading">
        <span className="status-indicator">⏳</span>
        <span>Loading system status...</span>
      </div>
    )
  }

  const isHealthy = health.status === 'healthy'
  const statusIcon = isHealthy ? '✅' : '⚠️'
  const statusClass = isHealthy ? 'healthy' : 'degraded'

  return (
    <div className={`health-status ${statusClass}`}>
      <div className="status-main">
        <span className="status-indicator">{statusIcon}</span>
        <span className="status-text">
          System Status: <strong>{health.status.toUpperCase()}</strong>
        </span>
      </div>
      
      {health.components && (
        <div className="status-components">
          <span>Agent: {health.components.agent === 'healthy' ? '✓' : '✗'}</span>
          <span>Vectors: {health.components.vector_stores === 'healthy' ? '✓' : '✗'}</span>
          <span>LLM: {health.components.llm_provider}</span>
        </div>
      )}
    </div>
  )
}

export default HealthStatus
