import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-foreground">
      <div className="max-w-md text-center space-y-6">
        {/* Decorative badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Project Setup Ready
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          React + Vite + shadcn/ui
        </h1>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          Tailwind CSS v4, Recharts, and Lucide React are configured. Start building your frontend application under <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">src/</code>.
        </p>

        {/* Action Button */}
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => alert('Setup is working perfectly!')}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
