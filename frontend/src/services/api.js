import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const sendMessage = async (customerId, message) => {
  const response = await api.post('/api/chat', {
    customerId,
    message,
  });
  return response.data;
};

export const getGreeting = async (customerId) => {
  const response = await api.post('/api/chat/greeting', {
    customerId,
  });
  return response.data;
};

export const getAllCustomers = async () => {
  try {
    const response = await api.get('/api/chat/customers');
    return response.data;
  } catch (error) {
    // Fallback to mock data if backend is not available
    console.warn('Backend not available, using mock data');
    return {
      customers: [
        {
          customerId: 'CUST001',
          name: 'Rajesh Kumar',
          plotNumber: 'A-1204',
          projectId: 'RW001'
        },
        {
          customerId: 'CUST002',
          name: 'Amit Sharma',
          plotNumber: 'B-305',
          projectId: 'RW001'
        },
        {
          customerId: 'CUST003',
          name: 'Priya Verma',
          plotNumber: 'C-102',
          projectId: 'RW002'
        }
      ]
    };
  }
};

// Voice API
export const synthesizeSpeech = async (text, voiceSettings = {}) => {
  try {
    const response = await api.post('/api/voice/synthesize', {
      text,
      voiceSettings,
    }, {
      responseType: 'blob',
    });
    
    // Check if response is JSON (error/fallback indicator)
    if (response.data.type === 'application/json') {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = reject;
        reader.readAsText(response.data);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Speech synthesis API error:', error);
    // Return fallback indicator
    return {
      useBrowserTTS: true,
      text: text,
      error: error.message
    };
  }
};

export const getVoices = async () => {
  const response = await api.get('/api/voice/voices');
  return response.data;
};

// Memory API
export const getConversationHistory = async (customerId) => {
  const response = await api.get(`/api/memory/${customerId}`);
  return response.data;
};

export const getCustomerContext = async (customerId) => {
  const response = await api.get(`/api/memory/${customerId}/context`);
  return response.data;
};

export const clearHistory = async (customerId) => {
  const response = await api.delete(`/api/memory/${customerId}`);
  return response.data;
};

// Construction API
export const getAllProjects = async () => {
  const response = await api.get('/api/construction/projects');
  return response.data;
};

export const getProjectInfo = async (projectId) => {
  const response = await api.get(`/api/construction/projects/${projectId}`);
  return response.data;
};

export const getDailyUpdate = async (projectId) => {
  const response = await api.get(`/api/construction/updates/${projectId}`);
  return response.data;
};

export const getTimeline = async (projectId) => {
  const response = await api.get(`/api/construction/timeline/${projectId}`);
  return response.data;
};

export default api;
