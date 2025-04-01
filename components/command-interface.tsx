import { useState, useCallback } from 'react';
import { useComputerControl } from '@/hooks/use-computer-control';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Card } from './ui/card';

export function CommandInterface() {
  const [command, setCommand] = useState('');
  const { writeText, moveMouse, click, isExecuting } = useComputerControl();

  // Basic actions that definitely work
  const actions = {
    moveAndClick: async (x: number, y: number) => {
      try {
        await moveMouse(x, y);
        await new Promise(r => setTimeout(r, 100));
        await click();
        toast.success(`Clicked at (${x}, ${y})`);
      } catch (error) {
        toast.error('Failed to move and click');
      }
    },

    typeText: async (text: string) => {
      try {
        await writeText(text);
        toast.success('Text typed');
      } catch (error) {
        toast.error('Failed to type text');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => actions.moveAndClick(500, 500)}
            disabled={isExecuting}
          >
            Click Center
          </Button>
          <Button
            onClick={() => actions.typeText('Hello World')}
            disabled={isExecuting}
          >
            Type "Hello World"
          </Button>
          <Button
            onClick={() => actions.moveAndClick(100, 100)}
            disabled={isExecuting}
          >
            Click Top-Left
          </Button>
          <Button
            onClick={() => actions.moveAndClick(800, 100)}
            disabled={isExecuting}
          >
            Click Top-Right
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Custom Command</h3>
        <div className="flex gap-2">
          <Input
            placeholder="type [text] or move [x] [y]"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isExecuting) {
                const cmd = command.toLowerCase().trim();
                if (cmd.startsWith('type ')) {
                  actions.typeText(command.slice(5));
                } else if (cmd.startsWith('move ')) {
                  const [x, y] = cmd.slice(5).split(' ').map(Number);
                  if (!isNaN(x) && !isNaN(y)) {
                    actions.moveAndClick(x, y);
                  } else {
                    toast.error('Invalid coordinates. Format: move X Y');
                  }
                } else {
                  toast.error('Unknown command. Try: type [text] or move [x] [y]');
                }
                setCommand('');
              }
            }}
          />
          <Button 
            onClick={() => {
              const cmd = command.toLowerCase().trim();
              if (cmd.startsWith('type ')) {
                actions.typeText(command.slice(5));
              } else if (cmd.startsWith('move ')) {
                const [x, y] = cmd.slice(5).split(' ').map(Number);
                if (!isNaN(x) && !isNaN(y)) {
                  actions.moveAndClick(x, y);
                } else {
                  toast.error('Invalid coordinates. Format: move X Y');
                }
              } else {
                toast.error('Unknown command. Try: type [text] or move [x] [y]');
              }
              setCommand('');
            }}
            disabled={isExecuting}
          >
            Execute
          </Button>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Available commands:</p>
        <ul className="list-disc list-inside mt-2">
          <li><code>type Hello World</code> - Types the specified text</li>
          <li><code>move 100 200</code> - Moves mouse and clicks at coordinates</li>
        </ul>
      </div>
    </div>
  );
} 