import React, { useEffect } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const VoiceInterfaceEnhanced = ({ onTranscript, disabled = false, autoSend = true }) => {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    browserInfo,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    fullTranscript,
  } = useSpeechRecognition();

  // Send transcript when speech ends
  useEffect(() => {
    if (transcript && !isListening && autoSend) {
      onTranscript(transcript);
      // Reset after sending
      setTimeout(() => resetTranscript(), 500);
    }
  }, [transcript, isListening, autoSend, onTranscript, resetTranscript]);

  const handleClick = () => {
    if (!isSupported) {
      alert(browserInfo.message);
      return;
    }

    if (disabled) {
      return;
    }

    toggleListening();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Microphone Button */}
      <button
        onClick={handleClick}
        disabled={disabled || !isSupported}
        className={`relative p-6 rounded-full transition-all duration-300 shadow-lg ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : isSupported
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-gray-400 cursor-not-allowed'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={
          !isSupported
            ? browserInfo.message
            : isListening
            ? 'Stop listening'
            : 'Start voice input'
        }
      >
        {isListening ? (
          <MicOff className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}

        {/* Listening indicator ring */}
        {isListening && (
          <span className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></span>
        )}
      </button>

      {/* Status Messages */}
      <div className="min-h-[60px] w-full max-w-md">
        {/* Browser Compatibility Warning */}
        {!isSupported && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Voice Input Not Supported
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {browserInfo.message}
              </p>
              <p className="text-xs text-amber-600 mt-2">
                <strong>Recommended:</strong> Use Chrome or Edge for voice input
              </p>
            </div>
          </div>
        )}

        {/* Listening State */}
        {isListening && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg animate-pulse">
            <Loader className="w-5 h-5 text-red-600 animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">
                Listening... Speak now
              </p>
              {interimTranscript && (
                <p className="text-xs text-red-700 mt-1 italic">
                  "{interimTranscript}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && !isListening && (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-900">
                You said:
              </p>
              <p className="text-sm text-gray-900 mt-1">
                "{transcript}"
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !isListening && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">
                Error
              </p>
              <p className="text-xs text-red-700 mt-1">
                {error}
              </p>
              {error.includes('permission') && (
                <p className="text-xs text-red-600 mt-2">
                  <strong>Fix:</strong> Allow microphone access in browser settings
                </p>
              )}
            </div>
          </div>
        )}

        {/* Browser Info (when idle) */}
        {isSupported && !isListening && !transcript && !error && (
          <div className="text-center">
            <p className="text-xs text-gray-600">
              {browserInfo.name} - {browserInfo.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: Hindi + English (Hinglish)
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      {isSupported && !isListening && !transcript && (
        <div className="text-center max-w-md">
          <p className="text-xs text-gray-600 mb-2">
            <strong>How to use:</strong>
          </p>
          <ol className="text-xs text-gray-600 text-left space-y-1">
            <li>1. Click the microphone button</li>
            <li>2. Speak in Hindi, English, or mix both</li>
            <li>3. Your speech will be converted to text</li>
            <li>4. Message will be sent automatically</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default VoiceInterfaceEnhanced;
