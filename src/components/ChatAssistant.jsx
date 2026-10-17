import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the Sai Meera AI assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (inputValue.length > 500) {
      setError("Please keep messages under 500 characters.");
      return;
    }

    const userMessage = { role: 'user', content: inputValue.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Note: Replace with actual Supabase project URL in production
      const functionUrl = import.meta.env.VITE_SUPABASE_URL 
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`
        : 'https://vbbofgtdfymhlyixgphv.supabase.co/functions/v1/chat-assistant';

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setError(err.message || "Sorry, I couldn't process your request right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-assistant-container">
      {/* Floating Toggle Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div>
            <h3>Sai Meera Assistant</h3>
            <span className="online-status">Online</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble typing">
                <Loader2 size={16} className="spin" /> Thinking...
              </div>
            </div>
          )}
          {error && (
            <div className="chat-error">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(null);
            }}
            placeholder="Ask about our services..."
            disabled={isLoading}
            maxLength={500}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
