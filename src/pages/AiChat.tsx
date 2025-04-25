import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const GeminiChat: React.FC = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = 'gemini-1.5-flash';
  const temperature = 0.7;

  const empathyContext = `You are a warm, friendly, and empathetic AI companion. 
  Your goal is to comfort users who feel lonely or isolated. Be kind, supportive, and encouraging. 
  Avoid medical or legal advice.`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useSpeechMode, setUseSpeechMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (messages.length === 0) {
      addSystemMessage("Hi there! I'm here whenever you want to talk 💬");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addSystemMessage = (content: string) => {
    setMessages(prev => [...prev, { role: 'model', content }]);
    if (useSpeechMode) speak(content);
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMessage = { role: 'user' as const, content: userText.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendToGemini(userMessage.content);
      if (response.error) {
        setError(response.error);
        addSystemMessage(`Oops! ${response.error}`);
      } else {
        addSystemMessage(response.text);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Something went wrong.';
      setError(errMsg);
      addSystemMessage(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const sendToGemini = async (userInput: string): Promise<{ text?: string; error?: string }> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [
        { role: 'user', parts: [{ text: empathyContext }] },
        { role: 'user', parts: [{ text: userInput }] }
      ],
      generationConfig: { temperature }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message || 'Unknown error occurred' };
    }

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { text: responseText || 'No response from Gemini.' };
  };

  const handleSpeechInput = () => {
    if (!recognition) {
      setError('Speech Recognition not supported.');
      return;
    }

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      handleSend(speechResult);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">EmpathiBot</h1>

        <div className="flex justify-center mb-4 space-x-4">
          <Button onClick={() => setUseSpeechMode(false)} variant={!useSpeechMode ? "primary" : "secondary"}>
            Text Mode
          </Button>
          <Button onClick={() => setUseSpeechMode(true)} variant={useSpeechMode ? "primary" : "secondary"}>
            Speech Mode
          </Button>
        </div>

        {isSpeaking && (
          <div className="flex justify-center mb-4">
            <Button onClick={stopSpeaking} variant="danger">
              Stop Speaking 🛑
            </Button>
          </div>
        )}

        <Card variant="elevated" className="h-[500px] overflow-y-auto p-4 bg-white mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-yellow-100 text-gray-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </Card>

        {error && <p className="text-red-500 text-center mb-2">⚠️ {error}</p>}

        {useSpeechMode ? (
          <div className="flex justify-center">
            <Button onClick={handleSpeechInput} disabled={loading}>
              🎙️ Start Talking
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea
              className="flex-1 p-3 border rounded resize-none focus:outline-none"
              rows={2}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GeminiChat;
