import { useState, useRef, useEffect } from 'react';
import { useSession } from '@/hooks/SessionContext';
import { useCart } from '@/hooks/CartContext';
import { useChatMutation, useDishes } from '@/services/queries';
import type { ChatMessage } from '@/services/types';
import { Send, Bot, User, X, Loader2 } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRestaurantContext } from '@/hooks/RestaurantContext';
import ReactMarkdown from 'react-markdown';

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const { userId } = useSession();
  const { addItem } = useCart();
  const { data: dishes } = useDishes();
  const { restaurant } = useRestaurantContext();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your AI Waiter. Looking for recommendations or have questions about our dishes?" }
  ]);

  const chatMutation = useChatMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSend = () => {
    if (!input.trim() || !userId) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');

    chatMutation.mutate(
      {
        user_id: userId,
        restaurant_id: restaurant?.id || 'restaurant_1',
        message: currentInput,
        conversation_history: messages,
        page_context: location.pathname,
        selected_dish_id: params.id,
      },
      {
        onSuccess: (data) => {
          if (data.message) {
            setMessages((prev) => [...prev, { role: 'assistant', content: data.message! }]);
          }

          if (data.updated_ui_actions) {
            data.updated_ui_actions.forEach((uiAction: { action: string; payload: any }) => {
              if (uiAction.action === 'NAVIGATE' && uiAction.payload?.path) {
                navigate(uiAction.payload.path);
              } else if (uiAction.action === 'ADD_TO_CART' && uiAction.payload?.dish_id) {
                const targetDish = dishes?.find((d) => d.id === uiAction.payload.dish_id);
                if (targetDish) {
                  addItem(targetDish, uiAction.payload.quantity || 1);
                }
              }
            });
          }
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: "Sorry, I ran into an error processing your request. Please try again." }
          ]);
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[500px] w-[350px] @sm:w-[400px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Dining Waiter</h3>
            <p className="text-xs text-muted-foreground">Always ready to help</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-1.5 rounded-xl shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-3 rounded-2xl text-xs @sm:text-sm max-w-[80%] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none font-medium' 
                : 'bg-muted/70 text-foreground rounded-tl-none border border-border/40 prose prose-sm prose-invert prose-p:leading-snug prose-strong:text-orange-400'
            }`}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>AI Waiter is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for recommendations..."
          className="flex-1 bg-muted px-4 py-2.5 text-xs @sm:text-sm rounded-full border border-border focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || chatMutation.isPending}
          className="p-2.5 bg-primary text-primary-foreground rounded-full disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
