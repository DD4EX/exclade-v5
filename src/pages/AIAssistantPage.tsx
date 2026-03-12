import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, Send, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getSmartAnswer } from '@/lib/ai-engine';

type Message = { role: 'user' | 'assistant'; content: string };

const AIAssistantPage = () => {
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const answer = getSmartAnswer(userMsg.content, schemes as any, lang);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setLoading(false);
    }, 300);
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">{t(lang, 'aiAssistant')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-base">{t(lang, 'askQuestion')}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg rounded-bl-none text-muted-foreground text-sm">
              ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-border bg-background shrink-0 safe-bottom">
        <div className="flex gap-2">
          <button onClick={startVoice} className="p-3 bg-muted rounded-lg">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </button>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={t(lang, 'askQuestion')}
            className="flex-1 h-12"
          />
          <button onClick={send} className="p-3 bg-primary text-primary-foreground rounded-lg">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
