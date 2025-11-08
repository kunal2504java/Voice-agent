import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Send, User, Volume2, Loader, Building2, MessageCircle, Sparkles } from 'lucide-react';
import ConstructionUpdate from './components/ConstructionUpdate';
import VoiceWaveform from './components/VoiceWaveform';
import { sendMessage, getGreeting, synthesizeSpeech, getAllCustomers } from './services/api';

// Memoized Message Component for performance
const ChatMessage = memo(({ message, isSpeaking }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
    <div className={`max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
      <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
          message.role === 'user' 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
        }`}>
          {message.role === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 text-white" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`rounded-2xl px-5 py-3 shadow-sm ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  </div>
));

ChatMessage.displayName = 'ChatMessage';

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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        setTimeout(() => handleSendMessage(transcript), 300);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleStartCall = async () => {
    if (!selectedCustomer) return;
    
    setIsCallActive(true);
    setMessages([]);
    
    try {
      const response = await getGreeting(selectedCustomer.customerId);
      const aiMessage = {
        role: 'assistant',
        content: response.greeting,
        timestamp: new Date().toISOString()
      };
      
      setMessages([aiMessage]);
      setConstructionUpdate(response.constructionUpdate);
      
      // Play greeting
      await playAudio(response.greeting);
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsCallActive(false);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setMessages([]);
    setConstructionUpdate(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || !selectedCustomer || isSending) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await sendMessage(
        selectedCustomer.customerId,
        messageText
      );

      const aiMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (response.constructionUpdate) {
        setConstructionUpdate(response.constructionUpdate);
      }

      await playAudio(response.response);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const playAudio = async (text) => {
    try {
      setIsSpeaking(true);
      
      try {
        const response = await synthesizeSpeech(text);
        
        if (response.useBrowserTTS) {
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
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => 
        voice.lang.startsWith('hi') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('hi'));
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-75"></div>
                <div className="relative p-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Riverwood AI Assistant
                </h1>
                <p className="text-sm text-gray-500">Smart Construction Updates</p>
              </div>
            </div>
            
            {isCallActive && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Customer Selection & Controls */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Customer Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Select Customer
              </h3>
              <select
                value={selectedCustomer?.customerId || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.customerId === e.target.value);
                  setSelectedCustomer(customer);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                disabled={isCallActive}
              >
                {customers.map(customer => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.name}
                  </option>
                ))}
              </select>
              
              {selectedCustomer && (
                <div className="mt-4 p-3 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                  <div className="text-xs text-gray-600 space-y-1.5">
                    <p className="flex justify-between">
                      <span className="font-medium">Plot:</span>
                      <span className="text-gray-800">{selectedCustomer.plotNumber}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Project:</span>
                      <span className="text-gray-800">{selectedCustomer.projectId}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Controls
              </h3>
              
              {!isCallActive ? (
                <button
                  onClick={handleStartCall}
                  disabled={!selectedCustomer}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Call
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <PhoneOff className="w-5 h-5" />
                  End Call
                </button>
              )}
            </div>

            {/* Construction Update Card */}
            {constructionUpdate && (
              <div className="animate-fadeIn">
                <ConstructionUpdate update={constructionUpdate} />
              </div>
            )}
          </div>

          {/* Center Panel - Chat Interface */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
              
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">Priya - AI Assistant</h2>
                      <p className="text-xs text-gray-500">
                        {isCallActive ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Ready to assist'}
                      </p>
                    </div>
                  </div>
                  
                  {isSpeaking && (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-emerald-500 animate-pulse" />
                      <VoiceWaveform isActive={isSpeaking} />
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
                {!isCallActive ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                        <Phone className="w-10 h-10 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Start a Conversation</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                          Select a customer and click "Start Call" to begin the AI-powered voice conversation
                        </p>
                      </div>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <ChatMessage key={idx} message={msg} isSpeaking={isSpeaking} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              {isCallActive && (
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleListening}
                      disabled={isSending || isSpeaking}
                      className={`p-3 rounded-xl transition-all shadow-md ${
                        isListening
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                          : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:shadow-lg'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message or use voice..."
                      disabled={isSending || isSpeaking}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isSending || isSpeaking}
                      className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      {isSending ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {isListening && (
                    <p className="text-xs text-center text-emerald-600 mt-2 animate-pulse">
                      🎤 Listening... Speak now
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
