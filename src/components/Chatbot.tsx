import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getChatbotResponse } from '@/lib/aiLogic';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: language === 'ta' ? 'வணக்கம்! 🙏 நான் உங்கள் விவசாய் AI உதவியாளர். எவ்வாறு உதவ முடியும்?' : 'Hello! 🙏 I\'m your VIVASAI AI assistant. How can I help?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      const response = getChatbotResponse(userMsg, language);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  return (
    <>
      {/* FAB */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg print:hidden"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 print:hidden">
          <Card className="flex h-[70vh] w-full max-w-lg flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-2">
                <span>🤖</span>
                <span className="font-semibold">{t('chat.title')}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t p-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend}><Send className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
