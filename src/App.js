import React, { useState, useEffect, useRef } from 'react';
import { Brain, User } from 'lucide-react';

const API_URL = 'https://memory-api.vatsal-2cc.workers.dev/memory';

const TwinMind = () => {
  const [userId, setUserId] = useState('');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleAPI = async (endpoint) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const url = endpoint === 'add' ? API_URL : `${API_URL}/ask?query=${encodeURIComponent(input)}&user=${encodeURIComponent(userId)}`;
      const method = endpoint === 'add' ? 'POST' : 'GET';
      const body = endpoint === 'add' ? JSON.stringify({ user: userId, data: input }) : undefined;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || JSON.stringify(data));
    } catch (err) {
      console.error('API request failed:', err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          <span className="text-blue-500">Twin</span>
          <span className="text-red-500">Mind</span>
        </h1>
        
        <div className="space-y-6">
          <div className="bg-[#1C1C1C] rounded-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
            <div className="p-6">
              <div className="flex flex-col items-center mb-4">
                <User className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">User ID</p>
              </div>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
                className="w-full bg-[#252525] text-white border-none rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-[#1C1C1C] rounded-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
            <div className="p-6">
              <div className="flex flex-col items-center mb-4">
                <Brain className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">TwinMind Interface</p>
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full min-h-[120px] bg-[#252525] text-white border-none rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex space-x-4 mt-4">
                <button 
                  onClick={() => handleAPI('query')}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                >
                  {loading ? 'Processing...' : 'Search Memories'}
                </button>
                <button 
                  onClick={() => handleAPI('add')}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                >
                  {loading ? 'Processing...' : 'Add Memory'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 text-white p-4 rounded">
              {error}
            </div>
          )}
          {response && (
            <div className="bg-[#1C1C1C] p-4 rounded">
              <h4 className="font-semibold mb-2 text-gray-300">Response:</h4>
              <p className="text-white">{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwinMind;