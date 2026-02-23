/**
 * MetricsBar.tsx
 *
 * Real-time metrics bar displayed below PhaseProgress.
 * Shows 7 metrics: Active, Idle, Elapsed, Events, Delegations, Messages, Models.
 * Updates every second via setInterval.
 *
 * Subscribes to: agentStatuses, sessionStartedAt, events, chatMessages from Zustand store.
 */
import { useEffect, useState } from 'react'
import { useDashboardStore } from '../../stores/dashboard-store'
import { AGENTS } from '../../lib/constants'

const TOTAL_AGENTS = Object.keys(AGENTS).length

export function MetricsBar() {
  const agentStatuses = useDashboardStore((s) => s.agentStatuses)
  const sessionStartedAt = useDashboardStore((s) => s.sessionStartedAt)
  const events = useDashboardStore((s) => s.events)
  const chatMessages = useDashboardStore((s) => s.chatMessages)

  // Tick state to force re-render every second
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Active agent count
  const activeCount = Object.values(agentStatuses).filter(
    (s) => s === 'working'
  ).length

  // Idle count
  const idleCount = TOTAL_AGENTS - activeCount

  // Elapsed time (mm:ss)
  let elapsedText = '--:--'
  if (sessionStartedAt) {
    const diffMs = Date.now() - sessionStartedAt.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const mm = String(Math.floor(diffSec / 60)).padStart(2, '0')
    const ss = String(diffSec % 60).padStart(2, '0')
    elapsedText = `${mm}:${ss}`
  }

  const eventCount = events.length

  // Delegation count from events
  const delegationCount = events.filter(
    (e) => (e as Record<string, unknown>).etype === 'delegation' || e.type === 'delegation'
  ).length

  // Chat message count
  const messageCount = chatMessages.length

  // Model distribution of working agents
  const modelCounts = { opus: 0, sonnet: 0, haiku: 0 }
  for (const [agentId, status] of Object.entries(agentStatuses)) {
    if (status === 'working') {
      const agent = AGENTS[agentId as keyof typeof AGENTS]
      if (agent) {
        modelCounts[agent.model]++
      }
    }
  }

  return (
    <div
      className="metrics-bar"
      role="status"
      aria-label="실시간 지표"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="metric-item">
        <span className="metric-label">Active</span>
        <span
          className={`metric-value${activeCount > 0 ? ' active' : ''}`}
          id="metric-active"
        >
          {activeCount}
        </span>
      </div>

      <div className="metric-sep" />

      <div className="metric-item">
        <span className="metric-label">Idle</span>
        <span className="metric-value" id="metric-idle">
          {idleCount}
        </span>
      </div>

      <div className="metric-sep" />

      <div className="metric-item">
        <span className="metric-label">Elapsed</span>
        <span className="metric-value" id="metric-elapsed">
          {elapsedText}
        </span>
      </div>

      <div className="metric-sep" />

      <div className="metric-item">
        <span className="metric-label">Events</span>
        <span className="metric-value" id="metric-events">
          {eventCount}
        </span>
      </div>

      <div className="metric-sep" />

      <div className="metric-item">
        <span className="metric-label">Delegations</span>
        <span className="metric-value" id="metric-delegations">
          {delegationCount}
        </span>
      </div>

      <div className="metric-sep" />

      <div className="metric-item">
        <span className="metric-label">Messages</span>
        <span className="metric-value" id="metric-messages">
          {messageCount}
        </span>
      </div>

      <div className="metric-sep" />

      <div className="metric-item">
        <span className="metric-label">Models</span>
        <span className="metric-value" id="metric-models">
          {modelCounts.opus > 0 && (
            <span className="metric-model-opus" title="Opus">{modelCounts.opus}O</span>
          )}
          {modelCounts.sonnet > 0 && (
            <span className="metric-model-sonnet" title="Sonnet">{modelCounts.sonnet}S</span>
          )}
          {modelCounts.haiku > 0 && (
            <span className="metric-model-haiku" title="Haiku">{modelCounts.haiku}H</span>
          )}
          {activeCount === 0 && <span style={{ opacity: 0.5 }}>--</span>}
        </span>
      </div>
    </div>
  )
}
