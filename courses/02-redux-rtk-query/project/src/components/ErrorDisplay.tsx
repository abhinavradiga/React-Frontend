interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display">
      <p>Something went wrong{message ? `: ${message}` : '.'}</p>
      {onRetry && (
        <button data-testid="retry-btn" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}