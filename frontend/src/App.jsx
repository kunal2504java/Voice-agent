import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Send, Trash2, History as HistoryIcon, User, Volume2, Loader } from 'lucide-react';
import ConstructionUpdate from './components/ConstructionUpdate';
import VoiceWaveform from './components/VoiceWaveform';
import ConversationHistory from './components/ConversationHistory';
import { sendMessage, getGreeting, synthesizeSpeech, getAllCustomers } from './services/api';

function App() {
  // State management
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [constructionUpdate, setConstructionUpdate] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);
  const [spokenText, setSpokenText] = useState('');
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadCustomers = async () => {
    try {
      const response = await getAllCustomers();
      setCustomers(response.customers);
      if (response.customers.length > 0) {
        setSelectedCustomer(response.customers[0]);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Hindi + English

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        setInputMessage(transcript);
        setIsListening(false);
        // Auto-send after speech recognition
        setTimeout(() => handleSendMessage(transcript), 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleStartCall = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }

    try {
      setIsSending(true);
      setIsCallActive(true);
      
      const response = await getGreeting(selectedCustomer.customerId);

      const greetingMessage = {
        role: 'assistant',
        content: response.greeting,
        timestamp: new Date().toISOString(),
      };

      setMessages([greetingMessage]);
      
      if (response.constructionUpdate) {
        setConstructionUpdate(response.constructionUpdate);
      }

      // Auto-play greeting
      await playAudio(response.greeting);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start call. Please check if the backend is running.');
      setIsCallActive(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setMessages([]);
    setConstructionUpdate(null);
    setSpokenText('');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  const handleStartListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpokenText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !selectedCustomer || !isCallActive) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setSpokenText('');
    setIsSending(true);

    try {
      const response = await sendMessage(
        selectedCustomer.customerId,
        message
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.constructionUpdate) {
        setConstructionUpdate(response.constructionUpdate);
      }

      // Auto-play response
      await playAudio(response.response);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const playAudio = async (text) => {
    try {
      setIsSpeaking(true);
      
      try {
        const response = await synthesizeSpeech(text);
        
        // Check if response indicates to use browser TTS
        if (response && typeof response === 'object' && response.useBrowserTTS) {
          console.log('Using browser TTS fallback');
          useBrowserTTS(text);
          return;
        }
        
        const audioBlob = response;
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audioRef.current.play();
      } catch (apiError) {
        console.log('ElevenLabs failed, using browser TTS:', apiError.message);
        useBrowserTTS(text);
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsSpeaking(false);
    }
  };

  const useBrowserTTS = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Hindi
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher for female voice
      
      // Try to find a female Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => 
        voice.lang.startsWith('hi') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('hi'));
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Browser TTS not supported');
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-700 shadow-lg border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg shadow-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Riverwood AI Voice Agent</h1>
                <p className="text-sm text-emerald-100">Daily Construction Updates in Hinglish</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className="p-2 text-white hover:bg-emerald-600 rounded-lg transition-colors"
                title="Toggle History"
              >
                <HistoryIcon className="w-5 h-5" />
              </button>
              {isCallActive && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white text-sm font-semibold">LIVE</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Customer & Controls */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Select Customer
              </h2>
              
              <select
                value={selectedCustomer?.customerId || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.customerId === e.target.value);
                  setSelectedCustomer(customer);
                  handleEndCall(); // End call when switching customers
                }}
                disabled={isCallActive}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {customers.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.name} - {customer.plotNumber}
                  </option>
                ))}
              </select>

              {selectedCustomer && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm font-semibold text-gray-900">{selectedCustomer.name}</p>
                  <p className="text-xs text-gray-600 mt-1">Plot: {selectedCustomer.plotNumber}</p>
                  <p className="text-xs text-gray-600">Project: {selectedCustomer.projectId}</p>
                </div>
              )}

              {/* Call Controls */}
              <div className="mt-6 space-y-3">
                {!isCallActive ? (
                  <button
                    onClick={handleStartCall}
                    disabled={!selectedCustomer || isSending}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-5 h-5" />
                    {isSending ? 'Starting Call...' : 'Start Call'}
                  </button>
                ) : (
                  <button
                    onClick={handleEndCall}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                  </button>
                )}
              </div>
            </div>

            {/* Construction Update Card */}
            {constructionUpdate && (
              <ConstructionUpdate update={constructionUpdate} />
            )}
          </div>

          {/* Main Chat Area */}
          <div className={`${showHistorySidebar ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
            <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-12rem)] flex flex-col border-2 border-emerald-100">
              {/* Chat Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-xl border-b-4 border-amber-500">
                <h3 className="text-lg font-bold text-white">
                  {isCallActive ? 'Active Conversation' : 'Ready to Start Call'}
                </h3>
                {isCallActive && selectedCustomer && (
                  <p className="text-sm text-emerald-100 mt-1">
                    Speaking with {selectedCustomer.name}
                  </p>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-emerald-50">
                {!isCallActive ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Phone className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Welcome to Riverwood Voice Agent
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Select a customer and click "Start Call" to begin
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            message.role === 'user' ? 'bg-emerald-100' : 'bg-amber-100'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="w-5 h-5 text-emerald-700" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-amber-700" />
                          )}
                        </div>
                        
                        <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div
                            className={`inline-block max-w-[80%] p-4 rounded-2xl shadow-md ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-none'
                                : 'bg-white text-gray-900 border-2 border-amber-200 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            {message.timestamp && (
                              <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-emerald-100' : 'text-gray-500'}`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Speaking Animation */}
                    {isSpeaking && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-amber-100">
                          <Volume2 className="w-5 h-5 text-amber-700" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-amber-200 rounded-2xl rounded-tl-none">
                          <span className="text-sm text-gray-700 font-medium">Speaking...</span>
                          <VoiceWaveform isActive={isSpeaking} />
                        </div>
                      </div>
                    )}

                    {/* Listening Indicator */}
                    {isListening && (
                      <div className="flex items-center justify-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                        <Mic className="w-5 h-5 text-red-600 animate-pulse" />
                        <span className="text-sm text-red-700 font-semibold">Listening... Speak now</span>
                        <VoiceWaveform isActive={isListening} color="red" />
                      </div>
                    )}

                    {/* Spoken Text Display */}
                    {spokenText && !isListening && (
                      <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">You said:</p>
                        <p className="text-base text-gray-900 font-medium">{spokenText}</p>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              {isCallActive && (
                <div className="border-t-2 border-emerald-100 p-4 bg-white rounded-b-xl">
                  <div className="flex items-center gap-3">
                    {/* Voice Input Button */}
                    <button
                      onClick={handleStartListening}
                      disabled={isSending || isSpeaking}
                      className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                        isListening
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? (
                        <MicOff className="w-6 h-6 text-white" />
                      ) : (
                        <Mic className="w-6 h-6 text-white" />
                      )}
                    </button>
                    
                    {/* Text Input */}
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                        placeholder="Type your message or use voice..."
                        disabled={isSending || isListening || isSpeaking}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <button
                        onClick={() => handleSendMessage(inputMessage)}
                        disabled={!inputMessage.trim() || isSending || isListening || isSpeaking}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Conversation History */}
          {showHistorySidebar && (
            <div className="lg:col-span-3">
              <ConversationHistory 
                customerId={selectedCustomer?.customerId}
                isCallActive={isCallActive}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-4 text-center text-sm text-gray-600 bg-white border-t-2 border-emerald-100">
        <p>Built with ❤️ for Riverwood Real Estate | Powered by OpenAI & ElevenLabs</p>
      </footer>
    </div>
  );
}

export default App;
