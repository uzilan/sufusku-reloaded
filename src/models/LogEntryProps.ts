import { LogEntry } from './LogEntry'

export interface LogEntryProps {
  log: LogEntry
  isSelected?: boolean
  onLogClick?: (log: LogEntry) => void
  onDropEventsAfter?: (logId: number) => void
  onRemoveLog?: (logId: number) => void
} 