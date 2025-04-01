'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Settings, Trash, Copy, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
}

export function ClipboardManager() {
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Monitor clipboard
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) return;
        
        // Don't add if it's the same as the last item
        if (items[0]?.text === text) return;

        const newItem = {
          id: Date.now().toString(),
          text,
          timestamp: Date.now()
        };

        setItems(prev => [newItem, ...prev].slice(0, 10));
      } catch (error) {
        console.error('Failed to read clipboard:', error);
      }
    };

    const interval = setInterval(checkClipboard, 1000);
    return () => clearInterval(interval);
  }, [items]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clipboard History</h2>
          <p className="text-muted-foreground mt-1">Recent items are saved automatically</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-9 px-4 flex gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setItems([])}
            className="h-9 px-4 flex gap-2"
          >
            <Trash className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">Clipboard Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                History Size
              </label>
              <Input
                type="number"
                min="5"
                max="50"
                defaultValue="10"
                className="max-w-[200px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Check Interval (ms)
              </label>
              <Input
                type="number"
                min="500"
                max="5000"
                step="500"
                defaultValue="1000"
                className="max-w-[200px]"
              />
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No clipboard history yet</p>
              <p className="mt-1">Copy something to see it here</p>
            </div>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground mb-1">
                  </div>
                  <div className="font-mono text-sm break-all">
                    {item.text.length > 200 
                      ? `${item.text.substring(0, 200)}...` 
                      : item.text}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.text)}
                    className="h-8 px-3 hover:bg-background"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://translate.google.com/?text=${encodeURIComponent(item.text)}`)}
                    className="h-8 px-3 hover:bg-background"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="sr-only">Open externally</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 