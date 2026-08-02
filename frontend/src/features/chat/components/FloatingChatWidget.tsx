import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
