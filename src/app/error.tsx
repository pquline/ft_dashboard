'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import ErrorPage from '@/components/ErrorPage'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error occurred:', error)
  }, [error])

  const customActions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button onClick={reset} className="flex-1">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  )

  return (
    <ErrorPage
      code={500}
      title="Something went wrong!"
      description="We encountered an unexpected error. Please try again or return to the home page."
      showRetry={false}
      customActions={customActions}
    />
  )
}
