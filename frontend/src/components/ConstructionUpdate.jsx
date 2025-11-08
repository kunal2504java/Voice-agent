import React from 'react';
import { Building2, Calendar, TrendingUp, Users, Cloud, Sparkles } from 'lucide-react';

const ConstructionUpdate = ({ update }) => {
  if (!update) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-50"></div>
          <div className="relative p-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Construction Update
          </h3>
          <p className="text-xs text-gray-500">{update.flatNumber}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            <strong>Date:</strong> {update.date}
          </span>
        </div>

        <div className="p-3 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Current Phase</p>
          <p className="text-sm text-gray-800 font-medium">{update.currentPhase}</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1">Today's Update</p>
          <p className="text-sm text-gray-800">{update.updateMessage}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              <p className="text-xs font-semibold text-gray-700">Progress</p>
            </div>
            <p className="text-xl font-bold text-green-600">{update.overallProgress}%</p>
          </div>

          <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-xs font-semibold text-gray-700">Workers</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{update.workersOnSite}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-700 font-medium">{update.weather}</span>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            update.completionStatus === 'On Schedule' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {update.completionStatus}
          </span>
        </div>

        <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl shadow-sm">
          <p className="text-xs font-semibold mb-1 opacity-90">Next Milestone</p>
          <p className="text-sm font-medium">{update.nextMilestone}</p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionUpdate;
