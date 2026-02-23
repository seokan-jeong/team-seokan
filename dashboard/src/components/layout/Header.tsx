/**
 * Header.tsx
 *
 * Top bar with brand identity, current task context, and connection status.
 * CurrentTask indicator shows docId + stage + active agent count between
 * brand and controls. Hidden below 768px.
 */
import { useDashboardStore } from '../../stores/dashboard-store'
import { STAGES } from '../../lib/constants'
import { SessionSelector } from '../session/SessionSelector'

// ── ConnectionBadge ──────────────────────────────────────────────────────────

interface BadgeProps {
  connected: boolean | 'reconnecting'
}

function ConnectionBadge({ connected }: BadgeProps) {
  let badgeClass: string
  let label: string
  let ariaLabel: string

  if (connected === true) {
    badgeClass = 'conn-badge connected'
    label = 'Connected'
    ariaLabel = '연결 상태: 연결됨'
  } else if (connected === 'reconnecting') {
    badgeClass = 'conn-badge reconnecting'
    label = 'Reconnecting…'
    ariaLabel = '연결 상태: 재연결 중'
  } else {
    badgeClass = 'conn-badge disconnected'
    label = 'Disconnected'
    ariaLabel = '연결 상태: 연결 끊김'
  }

  return (
    <div className={badgeClass} aria-label={ariaLabel} role="status">
      <div className="conn-dot" />
      <span>{label}</span>
    </div>
  )
}

// ── CurrentTask ──────────────────────────────────────────────────────────────

function CurrentTask() {
  const workflowDocId = useDashboardStore((s) => s.workflowDocId)
  const currentStage = useDashboardStore((s) => s.currentStage)
  const agentStatuses = useDashboardStore((s) => s.agentStatuses)

  const activeCount = Object.values(agentStatuses).filter(
    (s) => s === 'working'
  ).length

  const stageIdx = currentStage
    ? STAGES.findIndex((s) => s.id === currentStage)
    : -1
  const stageName = stageIdx >= 0 ? STAGES[stageIdx].label : null

  // Nothing to show if no workflow context
  if (!workflowDocId && !currentStage && activeCount === 0) return null

  return (
    <div className="header-task">
      {workflowDocId && (
        <span className="header-docid" title={workflowDocId}>
          {workflowDocId.length > 12 ? workflowDocId.slice(0, 12) + '...' : workflowDocId}
        </span>
      )}
      {stageName && (
        <span className="header-stage">{stageName}</span>
      )}
      {activeCount > 0 && (
        <span className="header-active-count">{activeCount} active</span>
      )}
    </div>
  )
}

// ── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const connected = useDashboardStore((s) => s.connected)

  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo">👦</div>
        <div>
          <h1>Team-Shinchan Dashboard</h1>
          <div className="subtitle">Multi-Agent Workflow Monitor</div>
        </div>
      </div>
      <CurrentTask />
      <div className="header-controls">
        <SessionSelector />
        <ConnectionBadge connected={connected} />
      </div>
    </header>
  )
}
