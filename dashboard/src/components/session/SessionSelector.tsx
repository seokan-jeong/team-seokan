/**
 * SessionSelector.tsx
 *
 * Dropdown for selecting active sessions.
 * Wraps in a div with active-session indicator (green left border)
 * and shows session count badge.
 */
import { useEffect } from 'react'
import { useDashboardStore } from '../../stores/dashboard-store'

export function SessionSelector() {
  const currentSessionId = useDashboardStore((s) => s.currentSessionId)
  const availableSessions = useDashboardStore((s) => s.availableSessions)
  const setCurrentSessionId = useDashboardStore((s) => s.setCurrentSessionId)
  const fetchSessions = useDashboardStore((s) => s.fetchSessions)

  // 주기적으로 세션 목록 갱신 (10초)
  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 10000)
    return () => clearInterval(interval)
  }, [fetchSessions])

  const hasActiveSessions = availableSessions.some((s) => s.active)

  return (
    <div className={`session-selector-wrapper${hasActiveSessions ? ' active-session' : ''}`}>
      <div className="session-selector">
        <select
          value={currentSessionId || ''}
          onChange={(e) => setCurrentSessionId(e.target.value || null)}
          className="session-select"
        >
          <option value="">All Sessions</option>
          {availableSessions.map((s) => (
            <option key={s.sessionId} value={s.sessionId}>
              {s.active ? '\u{1F7E2}' : '\u26AA'} {s.sessionId.length > 24 ? s.sessionId.slice(0, 24) + '…' : s.sessionId}
              {s.eventCount > 0 ? ` (${s.eventCount})` : ''}
            </option>
          ))}
        </select>
        {availableSessions.length > 0 && (
          <span className="session-count-badge">{availableSessions.length}</span>
        )}
      </div>
    </div>
  )
}
