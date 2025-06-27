import React, { useState } from 'react';
import { Send, ChefHat, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const initialMessages = [
  {
    id: 1,
    text: "Hello! I'm your AI cooking assistant. How can I help you with your recipe today?",
    sender: 'assistant'
  }
];

const LiveChatAssistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const { theme } = useTheme();
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user'
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage('');
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponses = [
          "Try reducing the heat and adding a splash of water if your pan is getting too hot.",
          "That sounds like it needs more salt. Taste and adjust the seasoning.",
          "If you don't have that ingredient, you can substitute it with something similar like yogurt instead of sour cream.",
          "The ideal internal temperature for chicken is 165°F (74°C) to ensure it's fully cooked.",
          "Let the dish rest for about 5 minutes before serving for the flavors to meld together."
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const assistantMessage = {
          id: messages.length + 2,
          text: randomResponse,
          sender: 'assistant'
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages(initialMessages);
    setNewMessage('');
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md h-full flex flex-col ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className={`p-3 ${
        theme === 'synesthesia'
          ? 'bg-purple-500'
          : 'bg-orange-500'
      } text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <ChefHat size={16} />
          <h3 className="font-semibold text-sm">Cooking Assistant</h3>
        </div>
        <button
          onClick={handleNewChat}
          className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          title="New Chat"
        >
          <RotateCcw size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: '180px' }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg px-2 py-1 text-xs ${
              message.sender === 'user'
                ? theme === 'synesthesia'
                  ? 'bg-purple-100 text-purple-800'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-orange-100 text-orange-800'
                : theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`p-2 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex gap-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your recipe..."
            className={`flex-1 px-2 py-1 rounded-l text-xs ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-gray-100 text-gray-800 border-gray-200'
            } border focus:outline-none`}
          />
          <button 
            onClick={handleSendMessage}
            className={`px-2 py-1 rounded-r ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600'
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white transition-colors`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatAssistant;