import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, User } from 'lucide-react';
import { getAllCustomers } from '../services/api';

const ProjectSelector = ({ selectedProject, onSelectProject }) => {
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await getAllCustomers();
      setCustomers(response.customers);
      if (response.customers.length > 0 && !selectedProject) {
        onSelectProject(response.customers[0]);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary-600" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {selectedProject?.name || 'Select Customer'}
            </p>
            {selectedProject && (
              <p className="text-xs text-gray-500">{selectedProject.plotNumber}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          {customers.map((customer) => (
            <button
              key={customer.customerId}
              onClick={() => {
                onSelectProject(customer);
                setIsOpen(false);
              }}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedProject?.customerId === customer.customerId ? 'bg-primary-50' : ''
              }`}
            >
              <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
              <p className="text-xs text-gray-500 mt-1">Plot: {customer.plotNumber}</p>
              <p className="text-xs text-gray-400 mt-1">Project: {customer.projectId}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
