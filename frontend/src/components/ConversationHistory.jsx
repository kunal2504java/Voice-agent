import React, { useState, useEffect } from 'react';
import { History, MessageCircle, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ConversationHistory = ({ customerId, isCallActive }) => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerId) {
      loadHistory();
      loadSummary();
    }
  }, [customerId]);

  const loadHistory = async () => {
    if (!customerId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/memory/${customerId}?lastN=5`
      );
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    if (!customerId) return;
    
    try {
      const response = await axios.get(
        `http://localhost:3001/api/memory/${customerId}/summary?lastN=5`
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to load summary:', error);
      setSummary(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-emerald-100 h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl border-b-4 border-emerald-600">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5" />
          Conversation History
        </h3>
        <p className="text-sm text-amber-100 mt-1">Last 5 conversations</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading history...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No conversation history yet</p>
              <p className="text-xs text-gray-500 mt-1">Start a call to begin</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            {summary && summary.hasHistory && (
              <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-lg p-4 border-2 border-emerald-200 mb-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Quick Summary
                </h4>
                
                {/* Topics */}
                {summary.recentTopics && summary.recentTopics.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Recent Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {summary.recentTopics.map((topic, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full"
                        >
                          {topic.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concerns */}
                {summary.concerns && summary.concerns.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Concerns:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {summary.concerns.map((concern, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full"
                        >
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentiment */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600">Overall Mood:</span>
                  <span className={`font-semibold ${
                    summary.sentiment === 'positive' ? 'text-green-600' :
                    summary.sentiment === 'concerned' ? 'text-amber-600' :
                    'text-gray-600'
                  }`}>
                    {summary.sentiment === 'positive' ? '😊 Positive' :
                     summary.sentiment === 'concerned' ? '😟 Concerned' :
                     '😐 Neutral'}
                  </span>
                </div>
              </div>
            )}

            {/* Conversation List */}
            <div className="space-y-3">
              {history.map((conversation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(conversation.date)}
                      </span>
                    </div>
                    {conversation.context && conversation.context.topic && (
                      <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                        {conversation.context.topic.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="bg-emerald-50 rounded-lg p-2 border-l-4 border-emerald-500">
                      <p className="text-xs text-gray-600 mb-1">Customer:</p>
                      <p className="text-sm text-gray-900">{conversation.userMessage}</p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-2 border-l-4 border-amber-500">
                      <p className="text-xs text-gray-600 mb-1">AI Response:</p>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {conversation.aiResponse}
                      </p>
                    </div>
                  </div>

                  {/* Context Info */}
                  {conversation.context && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {conversation.context.sentiment && (
                          <span className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              conversation.context.sentiment === 'positive' ? 'bg-green-500' :
                              conversation.context.sentiment === 'negative' ? 'bg-red-500' :
                              conversation.context.sentiment === 'inquiry' ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`}></span>
                            {conversation.context.sentiment}
                          </span>
                        )}
                        {conversation.context.concerns && conversation.context.concerns.length > 0 && (
                          <span className="text-amber-600">
                            • {conversation.context.concerns.length} concern(s)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {history.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t-2 border-gray-100">
          <p className="text-xs text-gray-600 text-center">
            Showing {history.length} recent conversation{history.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
