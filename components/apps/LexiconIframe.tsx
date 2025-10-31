'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';

interface LexiconIframeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LexiconIframe({ isOpen, onClose }: LexiconIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { account } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the required Lexicon API key and optional TTS API key
  const lexiconApiKey = account?.apiKeys.find(key => key.service === 'lexicon' && key.isActive);
  const ttsApiKey = account?.apiKeys.find(key => key.service === 'tts' && key.isActive);

  useEffect(() => {
    if (!isOpen || !iframeRef.current || !lexiconApiKey) return;

    const iframe = iframeRef.current;
    
    // Wait for iframe to load
    const handleLoad = () => {
      setIsLoading(false);
      
      // Send API keys to iframe
      if (iframe.contentWindow) {
        // Send Lexicon key (required)
        iframe.contentWindow.postMessage({
          type: 'SET_TTS_KEY',
          key: lexiconApiKey.key,
          provider: 'azure'
        }, 'https://web-lexicon-editor-content-development.dev.eastus.aks.skillsoft.com');

        // Send TTS key (optional) if available
        if (ttsApiKey) {
          iframe.contentWindow.postMessage({
            type: 'SET_TTS_KEY',
            key: ttsApiKey.key,
            provider: 'tts'
          }, 'https://web-lexicon-editor-content-development.dev.eastus.aks.skillsoft.com');
        }
      }
    };

    const handleError = () => {
      setError('Failed to load Lexicon Editor application');
      setIsLoading(false);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [isOpen, lexiconApiKey, ttsApiKey]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-white flex flex-col">
        {/* Content */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading Lexicon Editor...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    if (iframeRef.current) {
                      iframeRef.current.src = iframeRef.current.src;
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!lexiconApiKey && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-yellow-600 font-medium">No Lexicon API Key Configured</p>
                <p className="text-sm text-gray-600 mt-1">Please configure a Lexicon API key to use this application.</p>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src="https://web-lexicon-editor-content-development.dev.eastus.aks.skillsoft.com/?mode=suite"
            className="w-full h-full border-0"
            title="Lexicon Editor Application"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
          />
        </div>
    </div>
  );
}