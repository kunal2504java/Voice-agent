import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  DollarSign, 
  Zap, 
  CheckCircle, 
  MessageCircle,
  Database,
  Mic,
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DemoFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showTechnicalPanel, setShowTechnicalPanel] = useState(true);
  const [technicalMetrics, setTechnicalMetrics] = useState({
    totalLatency: 0,
    apiCalls: [],
    estimatedCost: 0,
    charactersProcessed: 0,
    memoryOperations: 0
  });

  const audioRef = useRef(null);

  // Demo conversation flow
  const demoSteps = [
    {
      id: 1,
      type: 'system',
      content: '📞 Initiating call to Rahul Kumar (Plot 45, Block A)...',
      delay: 1000,
      technical: {
        action: 'API: POST /api/chat/greeting',
        latency: 450,
        cost: 0.0012
      }
    },
    {
      id: 2,
      type: 'ai',
      speaker: 'Priya (AI)',
      content: 'Namaste Rahul ji! Good morning. Chai pi li aaj?',
      audio: true,
      delay: 2000,
      technical: {
        action: 'OpenAI GPT-4o-mini + ElevenLabs TTS',
        latency: 2800,
        cost: 0.0045,
        characters: 45
      }
    },
    {
      id: 3,
      type: 'user',
      speaker: 'Rahul Kumar',
      content: 'Haan pi li. Kya update hai?',
      delay: 3000,
      technical: {
        action: 'Web Speech API (Hindi recognition)',
        latency: 120,
        cost: 0
      }
    },
    {
      id: 4,
      type: 'system',
      content: '🔍 Fetching customer context and construction updates...',
      delay: 800,
      technical: {
        action: 'API: GET /api/memory/CUST001/context',
        latency: 180,
        cost: 0
      }
    },
    {
      id: 5,
      type: 'ai',
      speaker: 'Priya (AI)',
      content: 'Bahut badhiya! Aapke plot mein kal foundation ka kaam start hua hai. Block A mein 45% kaam complete ho gaya. Kal aapne kaha tha weekend pe aana chahte ho - still planning?',
      audio: true,
      delay: 2500,
      technical: {
        action: 'OpenAI GPT-4o-mini + ElevenLabs TTS',
        latency: 3200,
        cost: 0.0078,
        characters: 165
      }
    },
    {
      id: 6,
      type: 'user',
      speaker: 'Rahul Kumar',
      content: 'Haan, shanivar ko aunga',
      delay: 2500,
      technical: {
        action: 'Web Speech API (Hindi recognition)',
        latency: 95,
        cost: 0
      }
    },
    {
      id: 7,
      type: 'system',
      content: '💾 Saving conversation to memory...',
      delay: 600,
      technical: {
        action: 'API: POST /api/memory/CUST001/conversation',
        latency: 220,
        cost: 0
      }
    },
    {
      id: 8,
      type: 'ai',
      speaker: 'Priya (AI)',
      content: 'Perfect! Main Saturday subah reminder bhej dungi. Koi aur sawaal?',
      audio: true,
      delay: 2000,
      technical: {
        action: 'OpenAI GPT-4o-mini + ElevenLabs TTS',
        latency: 2400,
        cost: 0.0038,
        characters: 68
      }
    },
    {
      id: 9,
      type: 'user',
      speaker: 'Rahul Kumar',
      content: 'Nahi, bas itna hi. Thank you!',
      delay: 2000,
      technical: {
        action: 'Web Speech API (Hinglish recognition)',
        latency: 110,
        cost: 0
      }
    },
    {
      id: 10,
      type: 'ai',
      speaker: 'Priya (AI)',
      content: 'Dhanyavaad Rahul ji! Have a great day. Kal phir baat karenge!',
      audio: true,
      delay: 2000,
      technical: {
        action: 'OpenAI GPT-4o-mini + ElevenLabs TTS',
        latency: 2600,
        cost: 0.0042,
        characters: 72
      }
    },
    {
      id: 11,
      type: 'system',
      content: '✅ Call completed. Conversation saved to memory.',
      delay: 1000,
      technical: {
        action: 'Memory update + Context tracking',
        latency: 150,
        cost: 0
      }
    },
    {
      id: 12,
      type: 'summary',
      content: '📊 Call Summary',
      delay: 500,
      technical: {
        action: 'Generate summary',
        latency: 0,
        cost: 0
      }
    }
  ];

  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length) {
      const step = demoSteps[currentStep];
      const timer = setTimeout(() => {
        // Add message
        setMessages(prev => [...prev, step]);

        // Update technical metrics
        if (step.technical) {
          setTechnicalMetrics(prev => ({
            totalLatency: prev.totalLatency + step.technical.latency,
            apiCalls: [...prev.apiCalls, {
              action: step.technical.action,
              latency: step.technical.latency,
              timestamp: new Date().toISOString()
            }],
            estimatedCost: prev.estimatedCost + step.technical.cost,
            charactersProcessed: prev.charactersProcessed + (step.technical.characters || 0),
            memoryOperations: step.technical.action.includes('memory') ? prev.memoryOperations + 1 : prev.memoryOperations
          }));
        }

        // Play audio for AI messages
        if (step.audio && step.type === 'ai') {
          playAudioSimulation();
        }

        // Move to next step
        setCurrentStep(prev => prev + 1);
      }, step.delay);

      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length) {
      setIsPlaying(false);
      if (onComplete) onComplete();
    }
  }, [isPlaying, currentStep]);

  const playAudioSimulation = () => {
    // Simulate audio playback
    console.log('Playing audio...');
  };

  const startDemo = () => {
    setCurrentStep(0);
    setMessages([]);
    setIsPlaying(true);
    setTechnicalMetrics({
      totalLatency: 0,
      apiCalls: [],
      estimatedCost: 0,
      charactersProcessed: 0,
      memoryOperations: 0
    });
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setMessages([]);
    setIsPlaying(false);
    setTechnicalMetrics({
      totalLatency: 0,
      apiCalls: [],
      estimatedCost: 0,
      charactersProcessed: 0,
      memoryOperations: 0
    });
  };

  const formatLatency = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 border-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Play className="w-6 h-6" />
              Interactive Demo Experience
            </h2>
            <p className="text-emerald-100 mt-1">
              Realistic morning call simulation with Rahul Kumar
            </p>
          </div>
          <div className="flex gap-3">
            {!isPlaying && currentStep === 0 && (
              <button
                onClick={startDemo}
                className="bg-white text-emerald-700 font-bold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Start Demo
              </button>
            )}
            {currentStep > 0 && (
              <button
                onClick={resetDemo}
                className="bg-amber-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-amber-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Replay Demo
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-emerald-100 mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / demoSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-emerald-800 rounded-full h-3">
              <div
                className="bg-amber-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / demoSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border-2 border-emerald-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 border-b-4 border-amber-500">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Conversation
              </h3>
              <p className="text-emerald-100 text-sm mt-1">
                Customer: Rahul Kumar | Plot: 45, Block A
              </p>
            </div>

            {/* Messages */}
            <div className="p-6 space-y-4 min-h-[500px] max-h-[600px] overflow-y-auto bg-gradient-to-b from-white to-emerald-50">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                    <p className="text-gray-600">Click "Start Demo" to begin</p>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className="animate-fadeIn">
                  {message.type === 'system' && (
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border-2 border-gray-200">
                        {message.content}
                      </div>
                    </div>
                  )}

                  {message.type === 'ai' && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-white border-2 border-amber-200 rounded-2xl rounded-tl-none p-4 shadow-md">
                          <p className="text-xs font-semibold text-amber-700 mb-1">
                            {message.speaker}
                          </p>
                          <p className="text-gray-900">{message.content}</p>
                          {message.audio && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-amber-600">
                              <Volume2 className="w-4 h-4" />
                              <span>Audio playing...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {message.type === 'user' && (
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-tr-none p-4 shadow-md">
                          <p className="text-xs font-semibold text-emerald-100 mb-1">
                            {message.speaker}
                          </p>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {message.type === 'summary' && (
                    <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6 border-2 border-emerald-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        {message.content}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                          <p className="text-xs text-gray-600 mb-1">Total Duration</p>
                          <p className="text-2xl font-bold text-emerald-700">
                            {formatLatency(technicalMetrics.totalLatency)}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                          <p className="text-xs text-gray-600 mb-1">Estimated Cost</p>
                          <p className="text-2xl font-bold text-amber-700">
                            ${technicalMetrics.estimatedCost.toFixed(4)}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                          <p className="text-xs text-gray-600 mb-1">API Calls</p>
                          <p className="text-2xl font-bold text-emerald-700">
                            {technicalMetrics.apiCalls.length}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                          <p className="text-xs text-gray-600 mb-1">Characters</p>
                          <p className="text-2xl font-bold text-amber-700">
                            {technicalMetrics.charactersProcessed}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Key Insights:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>✓ Conversation remembered and saved to memory</li>
                          <li>✓ Saturday visit scheduled and tracked</li>
                          <li>✓ Natural Hinglish conversation maintained</li>
                          <li>✓ Context from previous conversations referenced</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden sticky top-6">
            {/* Header */}
            <button
              onClick={() => setShowTechnicalPanel(!showTechnicalPanel)}
              className="w-full bg-gray-800 px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Technical Metrics</h3>
              </div>
              {showTechnicalPanel ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </button>

            {showTechnicalPanel && (
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Real-time Metrics */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <p className="text-xs font-semibold text-emerald-900">Total Latency</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">
                      {formatLatency(technicalMetrics.totalLatency)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-amber-700" />
                      <p className="text-xs font-semibold text-amber-900">Estimated Cost</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">
                      ${technicalMetrics.estimatedCost.toFixed(4)}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      ~${(technicalMetrics.estimatedCost * 30).toFixed(2)}/month (daily calls)
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-blue-700" />
                      <p className="text-xs font-semibold text-blue-900">Memory Operations</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {technicalMetrics.memoryOperations}
                    </p>
                  </div>
                </div>

                {/* API Call Log */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">API Call Log</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {technicalMetrics.apiCalls.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No API calls yet</p>
                    ) : (
                      technicalMetrics.apiCalls.map((call, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-mono text-gray-900 flex-1">{call.action}</p>
                            <span className="text-emerald-600 font-semibold whitespace-nowrap">
                              {formatLatency(call.latency)}
                            </span>
                          </div>
                          <p className="text-gray-500 font-mono">
                            {new Date(call.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Cost Breakdown */}
                {technicalMetrics.estimatedCost > 0 && (
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Cost Breakdown</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">OpenAI API:</span>
                        <span className="font-semibold text-gray-900">
                          ${(technicalMetrics.estimatedCost * 0.6).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ElevenLabs TTS:</span>
                        <span className="font-semibold text-gray-900">
                          ${(technicalMetrics.estimatedCost * 0.4).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-900 font-bold">Total:</span>
                        <span className="font-bold text-emerald-700">
                          ${technicalMetrics.estimatedCost.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Notes */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Performance Notes</h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>Average response time: &lt; 3s</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>Voice recognition: Hindi + English</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>Memory: Persistent conversation history</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>Cost: ~$0.02 per 5-minute call</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DemoFlow;
