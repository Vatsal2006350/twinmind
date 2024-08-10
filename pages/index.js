import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const API_BASE_URL = 'https://memory-api.vatsal-2cc.workers.dev';

const AutoResizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-[200px] w-full bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg p-4 resize-none overflow-hidden rounded-md"
      style={{ height: 'auto' }}
    />
  );
};

const MemoryBox = ({ title, endpoint, buttonText, icon: Icon, gradientFrom, gradientTo }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let url, method, body;
      if (endpoint === 'add') {
        url = `${API_BASE_URL}/memory`;
        method = 'POST';
        body = JSON.stringify({ user: userId, data: input });
      } else {
        url = `${API_BASE_URL}/memory/ask?query=${encodeURIComponent(input)}&user=${encodeURIComponent(userId)}`;
        method = 'GET';
      }
      
      console.log(`Sending ${method} request to ${url}`);
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        },
        body: method === 'POST' ? body : undefined
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('API Error:', res.status, errorData);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('API Response:', data);
      setResponse(data.response || JSON.stringify(data));
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(`An error occurred: ${err.message}. Please check the console for more details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-900 border-none shadow-xl overflow-hidden rounded-lg">
      <div className={`h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
      <div className="p-6">
        <div className="flex flex-row items-center space-x-4 pb-6">
          <Icon className="w-10 h-10 text-gray-400" />
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>
        <div className="space-y-6">
          <AutoResizeTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
          />
          <button 
            onClick={() => handleSubmit(document.getElementById('userId').value)}
            disabled={loading}
            className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 text-lg`}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-900 text-white rounded-md">
              {error}
            </div>
          )}
          {response && (
            <div className="mt-6 p-6 bg-gray-800 rounded-md border border-gray-700">
              <h4 className="font-semibold mb-3 text-gray-300 text-xl">Response:</h4>
              <p className="text-white text-lg">{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>TwinMind AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          TwinMind AI
        </h1>
        <div className="mb-12">
          <label htmlFor="userId" className="block text-xl font-medium text-gray-300 mb-4">User ID</label>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              id="userId"
              type="text"
              placeholder="Enter your user ID"
              className="flex-grow bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg py-3 px-4 rounded-md"
            />
          </div>
        </div>
        <div className="space-y-16">
          <MemoryBox 
            title="Add Memory" 
            endpoint="add" 
            buttonText="Add Memory" 
            icon={() => (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
            gradientFrom="from-blue-600"
            gradientTo="to-blue-400"
          />
          <MemoryBox 
            title="Search Memories" 
            endpoint="query" 
            buttonText="Search" 
            icon={() => (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            gradientFrom="from-purple-600"
            gradientTo="to-pink-500"
          />
        </div>
      </div>
    </div>
  );
}