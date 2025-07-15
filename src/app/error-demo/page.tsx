'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ErrorPage from '@/components/ErrorPage'

const errorCodes = [
  { code: 400, name: 'Bad Request' },
  { code: 401, name: 'Unauthorized' },
  { code: 403, name: 'Forbidden' },
  { code: 404, name: 'Not Found' },
  { code: 500, name: 'Internal Server Error' },
  { code: 503, name: 'Service Unavailable' },
]

export default function ErrorDemoPage() {
  const [selectedError, setSelectedError] = useState<number | null>(null)

  if (selectedError) {
    return (
      <ErrorPage
        code={selectedError}
        customActions={
          <Button onClick={() => setSelectedError(null)} variant="outline">
            Back to Demo
          </Button>
        }
      />
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Error Page Demo</CardTitle>
          <CardDescription>
            Click on any error code below to see how the error page looks for different scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {errorCodes.map((error) => (
                  <Button
                    key={error.code}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setSelectedError(error.code)}
                  >
                    <span className="text-2xl font-bold">{error.code}</span>
                    <span className="text-sm text-muted-foreground">{error.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <div className="space-y-2">
                {errorCodes.map((error) => (
                  <Button
                    key={error.code}
                    variant="outline"
                    className="w-full justify-start h-12"
                    onClick={() => setSelectedError(error.code)}
                  >
                    <span className="font-mono mr-4">{error.code}</span>
                    <span>{error.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
