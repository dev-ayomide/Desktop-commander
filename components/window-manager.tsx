import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

interface WindowLayout {
  id: string;
  name: string;
  windows: Array<{
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
}

export function WindowManager() {
  const [layouts, setLayouts] = useLocalStorage<WindowLayout[]>('window-layouts', []);
  const [layoutName, setLayoutName] = useState('');

  const saveCurrentLayout = useCallback(async () => {
    if (!layoutName.trim()) {
      toast.error('Please provide a layout name');
      return;
    }

    try {
      // Get current window positions from Screenpipe
      const response = await fetch('http://localhost:3030/experimental/operator/windows', {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to get window positions');
      }

      const windows = await response.json();
      
      const newLayout: WindowLayout = {
        id: crypto.randomUUID(),
        name: layoutName,
        windows
      };

      setLayouts(prev => [...prev, newLayout]);
      setLayoutName('');
      toast.success('Layout saved successfully');
    } catch (error) {
      toast.error('Failed to save layout');
    }
  }, [layoutName]);

  const applyLayout = useCallback(async (layout: WindowLayout) => {
    try {
      // Apply window positions through Screenpipe
      for (const window of layout.windows) {
        await fetch('http://localhost:3030/experimental/operator/window', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: window.title,
            position: window.position,
            size: window.size
          })
        });
      }
      toast.success('Layout applied successfully');
    } catch (error) {
      toast.error('Failed to apply layout');
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Layout name"
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
        />
        <Button onClick={saveCurrentLayout} disabled={!layoutName.trim()}>
          Save Current Layout
        </Button>
      </div>

      {layouts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Saved Layouts</h3>
          <div className="space-y-2">
            {layouts.map((layout) => (
              <div key={layout.id} className="flex items-center gap-2">
                <span>{layout.name}</span>
                <Button
                  size="sm"
                  onClick={() => applyLayout(layout)}
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 