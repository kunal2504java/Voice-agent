import React from 'react';
import { Building2, Calendar, TrendingUp, Users, Cloud } from 'lucide-react';

const ConstructionUpdate = ({ update }) => {
  if (!update) return null;

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{update.projectName}</h3>
          <p className="text-sm text-gray-600">{update.flatNumber}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            <strong>Date:</strong> {update.date}
          </span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-blue-900 mb-1">Current Phase:</p>
          <p className="text-base text-gray-800">{update.currentPhase}</p>
        </div>

        <div className="p-3 bg-white rounded-lg border border-blue-100">
          <p className="text-sm font-semibold text-blue-900 mb-1">Today's Update:</p>
          <p className="text-base text-gray-800">{update.updateMessage}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold text-gray-700">Progress</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{update.overallProgress}%</p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-gray-700">Workers</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{update.workersOnSite}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Weather: {update.weather}</span>
          </div>
          <span className={`text-sm font-semibold ${
            update.completionStatus === 'On Schedule' ? 'text-green-600' : 'text-blue-600'
          }`}>
            {update.completionStatus}
          </span>
        </div>

        <div className="p-3 bg-blue-600 text-white rounded-lg">
          <p className="text-xs font-semibold mb-1">Next Milestone:</p>
          <p className="text-sm">{update.nextMilestone}</p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionUpdate;
