import { useState, useCallback } from 'react';

interface ComputerAction {
  type: 'WriteText' | 'MouseMove' | 'MouseClick';  // Removed KeyPress since it's problematic
  data: any;
}

// Only the most reliable keys
const KEY_MAPPINGS: Record<string, string> = {
  'enter': 'Return',
  'tab': 'Tab',
  'space': 'Space',
  'backspace': 'Backspace',
  'escape': 'Escape',
};

export function useComputerControl() {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeAction = useCallback(async (action: ComputerAction) => {
    setIsExecuting(true);
    try {
      console.log('Executing action:', action);
      const response = await fetch('http://localhost:3030/experimental/operator/pixel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute action');
      }

      return await response.json();
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const writeText = useCallback((text: string) => {
    return executeAction({ type: 'WriteText', data: text });
  }, [executeAction]);

  const moveMouse = useCallback((x: number, y: number) => {
    return executeAction({ type: 'MouseMove', data: { x, y } });
  }, [executeAction]);

  const click = useCallback(() => {
    return executeAction({ type: 'MouseClick', data: { button: 1 } });
  }, [executeAction]);

  return {
    isExecuting,
    writeText,
    moveMouse,
    click,
  };
} 