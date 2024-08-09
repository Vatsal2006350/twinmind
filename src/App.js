import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Alert, AlertDescription } from './components/ui/alert';
import { Brain, Search, User } from 'lucide-react';

// It's better to use an environment variable for the API key
const API_KEY = 'O4Pjl1u1QLF99gdXA8bbifqZrV3kS8shJuZga7rgfMQ';

const AutoResizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-[200px] bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg p-4 resize-none overflow-hidden"
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
        url = 'https://memory-api.vatsal-2cc.workers.dev/memory';
        method = 'POST';
        body = JSON.stringify({ user: userId, data: input });
      } else {
        url = `https://memory-api.vatsal-2cc.workers.dev/memory/ask?query=${encodeURIComponent(input)}&user=${encodeURIComponent(userId)}`;
        method = 'GET';
      }
      
      console.log(`Sending ${method} request to ${url}`);
      
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
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
    <Card className="w-full bg-gray-900 border-none shadow-xl overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
      <CardHeader className="flex flex-row items-center space-x-4 pb-6">
        <Icon className="w-10 h-10 text-gray-400" />
        <CardTitle className="text-3xl font-bold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AutoResizeTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
          />
          <Button 
            onClick={() => handleSubmit(document.getElementById('userId').value)}
            disabled={loading}
            className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 text-lg`}
          >
            {loading ? 'Processing...' : buttonText}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {response && (
            <div className="mt-6 p-6 bg-gray-800 rounded-md border border-gray-700">
              <h4 className="font-semibold mb-3 text-gray-300 text-xl">Response:</h4>
              <p className="text-white text-lg">{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TwinMindAI = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          TwinMind AI
        </h1>
        <div className="mb-12">
          <label htmlFor="userId" className="block text-xl font-medium text-gray-300 mb-4">User ID</label>
          <div className="flex items-center">
            <User className="w-6 h-6 text-gray-400 mr-3" />
            <Input
              id="userId"
              type="text"
              placeholder="Enter your user ID"
              className="flex-grow bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg py-3 px-4"
            />
          </div>
        </div>
        <div className="space-y-16">
          <MemoryBox 
            title="Add Memory" 
            endpoint="add" 
            buttonText="Add Memory" 
            icon={Brain}
            gradientFrom="from-blue-600"
            gradientTo="to-blue-400"
          />
          <MemoryBox 
            title="Search Memories" 
            endpoint="query" 
            buttonText="Search" 
            icon={Search}
            gradientFrom="from-purple-600"
            gradientTo="to-pink-500"
          />
        </div>
      </div>
    </div>
  );
};

export default TwinMindAI;