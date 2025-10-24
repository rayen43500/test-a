import React, { useEffect, useRef, useState } from 'react';
import chatService from '../../services/chatService';

export default function ChatSidebar({ open, onClose }) {
  // Start with an empty conversation; the assistant will reply to user input
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages, loading]);

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const timestamp = new Date().toISOString();
    const next = [...messages, { role: 'user', content: input, ts: timestamp }];
    setMessages(next);
    setInput('');
    setLoading(true);
      try {
      // Request concise response (answer the question directly, avoid follow-ups)
      const reply = await chatService.send(next.filter(m => m.role !== 'system'), { concise: true });
      // Ensure the assistant's reply is trimmed and does not include extra prompting
      const conciseReply = typeof reply === 'string' ? reply.trim() : JSON.stringify(reply);
      setMessages([...next, { role: 'assistant', content: conciseReply, ts: new Date().toISOString() }]);
    } catch (e) {
      // Prefer server-provided error message when available so the user sees the real cause
      console.error('Chat send error', e);
      const serverError = e?.response?.data?.error || e?.response?.data?.message || e?.message;
      setMessages([...next, { role: 'assistant', content: serverError || "Désolé, une erreur s'est produite.", ts: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay pour fermer en cliquant à l'extérieur */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Chat Window - Fenêtre flottante au centre */}
      <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-transform duration-300 ${open ? 'scale-100' : 'scale-95'}`}>
          {/* Header avec bouton fermer */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Assistant Carrière</h3>
                <p className="text-xs text-blue-100">IA spécialisée</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Fermer le chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  m.role === 'assistant'
                    ? 'bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-sm text-gray-800'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                }`}> 
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-xs font-semibold ${m.role === 'assistant' ? 'text-gray-600' : 'text-blue-100'}`}>
                      {m.role === 'assistant' ? '🤖 Assistant' : '👤 Vous'}
                    </div>
                    {m.ts && (
                      <div className="text-[10px] text-gray-400 ml-2">
                        {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm flex items-center">
                  <div className="mr-3">
                    <svg className="w-7 h-7 text-gray-400 animate-pulse" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 5.582 2 10c0 2.21 1 4.21 2.5 5.7L6 20l3.5-1.6C11.1 19.6 11.9 20 12.8 20c5.523 0 10-3.582 10-8s-4.477-10-10-10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Assistant en cours...</div>
                    <div className="text-xs text-gray-400">Génération de réponse…</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Posez votre question..."
                disabled={loading}
              />
              <button 
                onClick={send} 
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Astuce: Analyse CV, formations, conseils carrière
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


