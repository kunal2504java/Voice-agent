import React from 'react';

const VoiceWaveform = ({ isActive = false, color = 'emerald' }) => {
  const barCount = 5;
  
  const colorClasses = {
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500'
  };

  const bgClass = colorClasses[color] || colorClasses.emerald;

  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(barCount)].map((_, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-300 ${bgClass} ${
            isActive ? 'animate-wave' : 'h-2'
          }`}
          style={{
            animationDelay: `${index * 0.1}s`,
            height: isActive ? undefined : '8px'
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% {
            height: 8px;
          }
          50% {
            height: 24px;
          }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VoiceWaveform;
