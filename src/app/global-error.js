'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-8">
          <h2 className="text-3xl font-bold">Critical System Error</h2>
          <p className="text-muted-foreground text-center">
            A fatal error occurred at the application root level.
          </p>
          <div className="bg-muted p-4 rounded-md text-sm font-mono text-red-500 max-w-lg overflow-auto">
            {error.message || 'Unknown error'}
          </div>
          <Button onClick={() => reset()}>Restart Application</Button>
        </div>
      </body>
    </html>
  );
}
