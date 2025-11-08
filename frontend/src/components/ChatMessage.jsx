import React from 'react';
import { User, Bot, Volume2 } from 'lucide-react';

const ChatMessage = ({ message, onPlayAudio }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-100' : 'bg-green-100'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-primary-600" />
        ) : (
          <Bot className="w-5 h-5 text-green-600" />
        )}
      </div>
      
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block max-w-[80%] p-4 rounded-2xl ${
            isUser
              ? 'bg-primary-600 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-900 rounded-tl-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          {message.timestamp && (
            <p className={`text-xs mt-2 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {!isUser && onPlayAudio && (
          <button
            onClick={() => onPlayAudio(message.content)}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Volume2 className="w-4 h-4" />
            Play Audio
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
