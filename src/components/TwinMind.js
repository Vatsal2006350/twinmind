import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Brain, Search, User } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/memory';

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
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-500">
            Twin
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800">
            Mind
          </span>
        </h1>
        
        <Card className="w-full bg-gray-900 border-none shadow-xl overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-blue-800 to-red-800" />
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <User className="w-8 h-8 text-gray-400" />
            <CardTitle className="text-2xl font-bold text-white">User ID</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </CardContent>
        </Card>

        <Card className="w-full bg-gray-900 border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-800 to-red-800" />
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Brain className="w-8 h-8 text-gray-400" />
            <CardTitle className="text-2xl font-bold text-white">TwinMind Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full min-h-[120px] bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
                style={{ height: 'auto' }}
              />
              <div className="flex space-x-4">
                <Button 
                  onClick={() => handleAPI('query')}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-800 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {loading ? 'Processing...' : 'Search Memories'}
                </Button>
                <Button 
                  onClick={() => handleAPI('add')}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-800 to-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {loading ? 'Processing...' : 'Add Memory'}
                </Button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {response && (
                <div className="mt-4 p-4 bg-gray-800 rounded-md border border-gray-700">
                  <h4 className="font-semibold mb-2 text-gray-300">Response:</h4>
                  <p className="text-white">{response}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TwinMind;
