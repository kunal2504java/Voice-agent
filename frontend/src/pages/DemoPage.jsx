import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import DemoFlow from '../components/DemoFlow';

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-700 shadow-lg border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Riverwood AI Voice Agent - Interactive Demo
              </h1>
              <p className="text-emerald-100 mt-2">
                Experience a realistic morning call with natural Hinglish conversation
              </p>
            </div>
            <a
              href="/"
              className="bg-white text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </a>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-semibold mb-1">
              About This Demo
            </p>
            <p className="text-sm text-blue-800">
              This is a simulated conversation flow showing how the AI voice agent interacts with customers.
              In production, this would use real OpenAI and ElevenLabs APIs for natural conversation and voice synthesis.
              The demo showcases conversation memory, context awareness, and Hinglish language support.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <DemoFlow 
          onComplete={() => {
            console.log('Demo completed!');
          }}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-600 bg-white border-t-2 border-emerald-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">
            Built with ❤️ for Riverwood Real Estate | Powered by OpenAI & ElevenLabs
          </p>
          <p className="text-xs text-gray-500">
            Demo simulation - Actual implementation uses real AI APIs for production deployment
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage;
