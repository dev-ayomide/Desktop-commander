import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

export interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  type: 'text' | 'code';
}

export function useClipboardHistory() {
  const [history, setHistory] = useLocalStorage<ClipboardItem[]>('clipboard-history', []);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    const handleClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text || history.some(item => item.text === text)) return;

        // Detect if it's code (simple heuristic)
        const isCode = text.includes('{') || text.includes('function') || text.includes('class');

        const newItem: ClipboardItem = {
          id: crypto.randomUUID(),
          text,
          timestamp: Date.now(),
          type: isCode ? 'code' : 'text'
        };

        setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50 items
      } catch (error) {
        console.error('Failed to read clipboard:', error);
      }
    };

    // Check clipboard every second
    const interval = setInterval(handleClipboard, 1000);
    return () => clearInterval(interval);
  }, [isListening, history, setHistory]);

  return {
    history,
    setHistory,
    startListening: () => setIsListening(true),
    stopListening: () => setIsListening(false),
    clearHistory: () => setHistory([])
  };
} 