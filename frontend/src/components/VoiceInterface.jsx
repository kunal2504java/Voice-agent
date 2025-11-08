import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceInterface = ({ onTranscript, isListening, onStartListening, onStopListening }) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Hindi + English

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        onStopListening();
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onStopListening();
      };

      recognitionRef.current.onend = () => {
        onStopListening();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onStopListening]);

  const handleMicClick = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      onStopListening();
    } else {
      recognitionRef.current.start();
      onStartListening();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={handleMicClick}
        disabled={!isSupported}
        className={`p-6 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary-600 hover:bg-primary-700'
        } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <MicOff className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>
    </div>
  );
};

export default VoiceInterface;
