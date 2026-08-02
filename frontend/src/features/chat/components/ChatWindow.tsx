import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { useChat } from '@/shared/services/queries';
import type { ChatMessage } from '@/shared/types';
import { useSession } from '@/shared/context/SessionContext';

import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Hi! I'm TasteAI, your personal dining assistant. I know this menu inside out and have reviewed your Taste Profile. What can I help you find today?"
  }]);
  const [input, setInput] = useState('');
  
  const { userId } = useSession();
  
  const navigate = useNavigate();
  const location = useLocation();
  const chatMutation = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractContext = () => {
    // Basic context extraction from URL
    const isDishDetail = location.pathname.startsWith('/dish/');
    const dishId = isDishDetail ? location.pathname.split('/').pop() : undefined;
    return {
      page_context: isDishDetail ? 'dish_detail' : 'menu_browse',
      selected_dish_id: dishId
    };
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !userId) return;
    
    const newMsg: ChatMessage = { role: 'user', content: text };
    const newHistory = [...messages, newMsg];
    setMessages(newHistory);
    setInput('');
    
    const context = extractContext();
    
    try {
      const response = await chatMutation.mutateAsync({
        message: text,
        user_id: userId,
        restaurant_id: '1', // Hardcoded for now based on seed
        page_context: context.page_context,
        selected_dish_id: context.selected_dish_id,
        conversation_history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      
      if (response.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
      }
      
      // Handle UI Actions if any
      if (response.updated_ui_actions) {
        response.updated_ui_actions.forEach((action: any) => {
          if (action.action === 'NAVIGATE') {
            navigate(action.payload.path);
          } else if (action.action === 'ADD_TO_CART') {
            // Need a way to fetch the dish, but for simplicity we rely on navigate to dish or global context
            // Ideally backend returns full dish object for cart, but we'll mock it for now
            console.log("Adding to cart", action.payload);
          }
        });
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'system', content: 'Sorry, I encountered an error connecting to the brain.' }]);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold">TasteAI Assistant</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-primary-foreground/20 rounded-full transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : msg.role === 'system'
                ? 'bg-destructive/10 text-destructive text-sm italic'
                : 'bg-muted rounded-tl-sm'
            }`}>
              <div className="flex items-start gap-2">
                {msg.role === 'assistant' && <Bot className="w-4 h-4 mt-0.5 shrink-0" />}
                <div className="prose prose-sm dark:prose-invert break-words leading-tight">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar snap-x">
          {["What should I order?", "I don't like spicy food", "Show me vegetarian options"].map(q => (
            <button 
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap shrink-0 snap-center bg-muted hover:bg-muted/80 text-xs px-3 py-1.5 rounded-full border border-border transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border bg-background">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TasteAI..."
            disabled={chatMutation.isPending || !userId}
            className="flex-1 bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || chatMutation.isPending || !userId}
            className="p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
