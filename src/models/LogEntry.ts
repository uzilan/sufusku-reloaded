export interface LogEntry {
  id: number
  message: string
  type: string
  hasError: boolean
  boardState: number[][]
} 