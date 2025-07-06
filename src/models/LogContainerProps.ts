import { LogEntry } from './LogEntry'

export interface LogContainerProps {
  logs: LogEntry[]
  maxLogs?: number
  onLogClick?: (log: LogEntry) => void
  onDropEventsAfter?: (logId: number) => void
  onRemoveLog?: (logId: number) => void
  selectedLogId?: number | null
} 