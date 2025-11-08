import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech API integration
 * Supports Hindi + English (Hinglish) speech recognition
 * 
 * Note: For production with better Hindi support, consider Deepgram API:
 * - More accurate Hindi recognition
 * - Better handling of code-mixed languages (Hinglish)
 * - Real-time streaming support
 * - See: https://deepgram.com/
 */

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const [browserInfo, setBrowserInfo] = useState({
    name: '',
    isCompatible: false,
    message: ''
  });

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Check browser compatibility on mount
  useEffect(() => {
    checkBrowserCompatibility();
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  /**
   * Check browser compatibility for Web Speech API
   */
  const checkBrowserCompatibility = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let browserName = 'Unknown';
    let compatible = false;
    let message = '';

    // Detect browser
    if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg') === -1) {
      browserName = 'Chrome';
      compatible = true;
      message = 'Full support for Hindi + English speech recognition';
    } else if (userAgent.indexOf('edg') > -1) {
      browserName = 'Edge';
      compatible = true;
      message = 'Full support for Hindi + English speech recognition';
    } else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
      browserName = 'Safari';
      compatible = false;
      message = 'Limited support. Please use Chrome or Edge for best experience';
    } else if (userAgent.indexOf('firefox') > -1) {
      browserName = 'Firefox';
      compatible = false;
      message = 'Speech recognition not supported. Please use Chrome or Edge';
    } else {
      browserName = 'Unknown';
      compatible = false;
      message = 'Speech recognition may not be supported. Please use Chrome or Edge';
    }

    // Check if Web Speech API is available
    const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    setBrowserInfo({
      name: browserName,
      isCompatible: compatible && hasWebSpeech,
      message: hasWebSpeech ? message : 'Voice input not supported in your browser. Please type your message.'
    });

    setIsSupported(compatible && hasWebSpeech);
  };

  /**
   * Initialize Speech Recognition
   */
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configuration for optimal Hinglish recognition
      recognition.continuous = false; // Stop after one phrase
      recognition.interimResults = true; // Show results as user speaks
      recognition.maxAlternatives = 3; // Get multiple alternatives
      
      // Language settings - Hindi + English
      // 'hi-IN' works best for Hinglish (code-mixed Hindi-English)
      recognition.lang = 'hi-IN';

      // Event handlers
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError(null);
        finalTranscriptRef.current = '';
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        // Update interim results (what's being spoken)
        if (interim) {
          setInterimTranscript(interim);
        }

        // Update final results
        if (final) {
          finalTranscriptRef.current += final;
          setTranscript(finalTranscriptRef.current.trim());
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable it in browser settings.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition aborted.';
            break;
          case 'language-not-supported':
            errorMessage = 'Hindi language not supported in this browser.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }

        setError(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      setIsSupported(true);
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setError('Failed to initialize speech recognition');
      setIsSupported(false);
    }
  };

  /**
   * Start listening
   */
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized');
      return;
    }

    if (isListening) {
      console.log('Already listening');
      return;
    }

    try {
      // Reset state
      setError(null);
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');

      // Start recognition
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
    }
  }, [isListening]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  }, []);

  /**
   * Toggle listening
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  /**
   * Reset transcript
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
  }, []);

  /**
   * Change language
   * @param {string} lang - Language code (e.g., 'hi-IN', 'en-US', 'en-IN')
   */
  const changeLanguage = useCallback((lang) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
      console.log(`Language changed to: ${lang}`);
    }
  }, []);

  return {
    // State
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    browserInfo,

    // Methods
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    changeLanguage,

    // Computed
    hasTranscript: transcript.length > 0,
    fullTranscript: transcript + (interimTranscript ? ' ' + interimTranscript : ''),
  };
};

export default useSpeechRecognition;

/**
 * ALTERNATIVE: Deepgram Integration for Production
 * 
 * For better Hindi and Hinglish support, consider using Deepgram API:
 * 
 * Installation:
 * npm install @deepgram/sdk
 * 
 * Example Implementation:
 * 
 * import { createClient } from '@deepgram/sdk';
 * 
 * const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
 * 
 * const useDeepgramRecognition = () => {
 *   const [transcript, setTranscript] = useState('');
 *   
 *   const startRecording = async () => {
 *     const mediaRecorder = await navigator.mediaDevices.getUserMedia({ audio: true });
 *     
 *     const connection = deepgram.listen.live({
 *       model: 'nova-2',
 *       language: 'hi', // Hindi
 *       smart_format: true,
 *       interim_results: true,
 *     });
 *     
 *     connection.on('Results', (data) => {
 *       const transcript = data.channel.alternatives[0].transcript;
 *       setTranscript(transcript);
 *     });
 *     
 *     // Send audio to Deepgram
 *     mediaRecorder.ondataavailable = (event) => {
 *       connection.send(event.data);
 *     };
 *   };
 *   
 *   return { transcript, startRecording };
 * };
 * 
 * Benefits of Deepgram:
 * - Better Hindi accuracy (90%+ vs 70-80% with Web Speech API)
 * - Real-time streaming
 * - Better handling of code-mixed languages (Hinglish)
 * - Punctuation and formatting
 * - Speaker diarization
 * - Custom vocabulary support
 * 
 * Pricing:
 * - Pay-as-you-go: $0.0043 per minute
 * - Free tier: $200 credits (46,000 minutes)
 * 
 * Setup:
 * 1. Sign up at https://deepgram.com/
 * 2. Get API key from dashboard
 * 3. Add to .env: VITE_DEEPGRAM_API_KEY=your_key
 * 4. Replace useSpeechRecognition with useDeepgramRecognition
 */
