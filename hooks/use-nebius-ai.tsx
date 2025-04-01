import { useState } from 'react';
import { useLocalStorage } from './use-local-storage';

interface NebiusConfig {
  apiKey: string;
  model: string;
}

export function useNebiusAI() {
  const [config, setConfig] = useLocalStorage<NebiusConfig>('nebius-config', {
    apiKey: '',
    model: 'general'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = async (text: string, type: 'summarize' | 'translate' | 'format') => {
    if (!config.apiKey) {
      throw new Error('Please configure your Nebius API key');
    }

    setIsProcessing(true);
    try {
      const response = await fetch('https://api.nebius.ai/v1/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          text,
          type,
          model: config.model
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      return await response.json();
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    config,
    setConfig,
    isProcessing,
    summarize: (text: string) => processText(text, 'summarize'),
    translate: (text: string) => processText(text, 'translate'),
    format: (text: string) => processText(text, 'format')
  };
} 