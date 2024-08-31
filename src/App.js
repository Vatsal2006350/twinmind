import React, { useState, useEffect, useRef } from 'react';
import { Brain, User } from 'lucide-react';

const API_URL = 'https://thirdear-backend-git-feat-add-initial-memor-aeaf8e-third-ear-ai.vercel.app/api/v1';
const VERCEL_PROTECTION_BYPASS_SECRET = 'K1oNTqR7cjtbhehlqxQgxSP9As13QAeE';
const BEARER_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtWX2RaamRVd19Gd2xDU0R0Vi1hUyJ9.eyJlbWFpbCI6InRlYW1AdGhpcmRlYXIuYWkiLCJuYW1lIjoiVGVhbSBUaGlyZEVhciIsInRoaXJkZWFyX3VzZXJfaWQiOiJkOTg4NDkwNy1iOThkLTRlMDMtODliYi1mMTVjZDhjN2MwNmIiLCJpc3MiOiJodHRwczovL2Rldi01eWxubm13ZDdyYmF6MTB5LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMzQ1NDg0NjMxMTMwMjQyMzg1OSIsImF1ZCI6WyJodHRwczovL2FwaS50aGlyZGVhci5saXZlIiwiaHR0cHM6Ly9kZXYtNXlsbm5td2Q3cmJhejEweS51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI1MTIzMTc1LCJleHAiOjE3MjUxMjkxNzUsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJ4bDJyUXo5anp2amF0R2FvclN0MnNUaHBKa0RlaDd4biJ9.trpwzzS7C9E9QDbkYuw4myx0kPWlqkoMorJGjfL6WzRA_lKZD7RqdC8QSQfUfWBqL-F1qRVdGQrCwIolULEblmWpiMhuuzKF4RdBYMbhXZ2sGH8tnrObzUdV236--fTFRFfi0Rw91p6rnkEoTw3O0RhKd9ciG5-t7x_wFZC_hu1GzmpOu8xilvvb1m3Zua-ZLYU8EEdzG0VfbRUNS1VwsCboGjoIgcS6uxZBjQ6dkhm25GK4fUg_YPAjxJpbsXLqroiD2JL4WEwNOcT80raOvKFeoIUcVv7bF6iGauFZW7z54_Pk_ceqOxuQ1BTwiDRQ68edoyB5OQfgOyX3alNBsA';

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
      const url = `${API_URL}/${endpoint === 'add' ? 'add_memory' : 'search_memory'}`;
      const method = 'POST';
      const body = endpoint === 'add' 
        ? JSON.stringify({ memory: [input] })
        : JSON.stringify({ keywords: input.split(/\s+/) });

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'x-vercel-protection-bypass': VERCEL_PROTECTION_BYPASS_SECRET,
        },
        body,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(endpoint === 'add' ? JSON.stringify(data) : JSON.stringify(data.memories));
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