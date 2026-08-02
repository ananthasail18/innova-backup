import { useState } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { MessageSquare } from 'lucide-react';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-2xl hover:bg-primary/90 transition-transform hover:scale-105"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>Ask AI Waiter</span>
        </button>
      )}
    </div>
  );
}
