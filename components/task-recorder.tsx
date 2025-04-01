import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useComputerControl } from '@/hooks/use-computer-control';

interface RecordedTask {
  id: string;
  name: string;
  actions: Array<{
    type: string;
    data: any;
    timestamp: number;
  }>;
}

export function TaskRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [currentActions, setCurrentActions] = useState<RecordedTask['actions']>([]);
  const [savedTasks, setSavedTasks] = useLocalStorage<RecordedTask[]>('recorded-tasks', []);
  const { writeText, pressKey, moveMouse, clickMouse } = useComputerControl();

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setCurrentActions([]);
    
    // Start listening to mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      setCurrentActions(prev => [...prev, {
        type: 'MouseMove',
        data: { x: e.clientX, y: e.clientY },
        timestamp: Date.now()
      }]);
    };

    // Start listening to clicks
    const handleClick = (e: MouseEvent) => {
      setCurrentActions(prev => [...prev, {
        type: 'MouseClick',
        data: { button: e.button === 0 ? 'left' : 'right' },
        timestamp: Date.now()
      }]);
    };

    // Start listening to key presses
    const handleKeyPress = (e: KeyboardEvent) => {
      setCurrentActions(prev => [...prev, {
        type: 'KeyPress',
        data: e.key,
        timestamp: Date.now()
      }]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    // Stop listening to user actions
  }, []);

  const saveTask = useCallback(() => {
    if (!taskName.trim() || currentActions.length === 0) {
      toast.error('Please provide a task name and record some actions');
      return;
    }

    const newTask: RecordedTask = {
      id: crypto.randomUUID(),
      name: taskName,
      actions: currentActions,
    };

    setSavedTasks((prev) => [...prev, newTask]);
    setTaskName('');
    setCurrentActions([]);
    toast.success('Task saved successfully');
  }, [taskName, currentActions, setSavedTasks]);

  const replayTask = useCallback(async (task: RecordedTask) => {
    for (const action of task.actions) {
      switch (action.type) {
        case 'MouseMove':
          await moveMouse(action.data.x, action.data.y);
          break;
        case 'MouseClick':
          await clickMouse(action.data.button);
          break;
        case 'KeyPress':
          await pressKey(action.data);
          break;
      }
      // Add small delay between actions
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }, [moveMouse, clickMouse, pressKey]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Button
          onClick={saveTask}
          disabled={isRecording || !taskName.trim() || currentActions.length === 0}
        >
          Save Task
        </Button>
      </div>

      {savedTasks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Saved Tasks</h3>
          <div className="space-y-2">
            {savedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                <span>{task.name}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    // Implement task replay logic here
                    toast.success('Task replaying...');
                  }}
                >
                  Replay
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 