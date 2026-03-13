import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, Send, Mic, MicOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getSmartAnswer, getQuickReplies } from '@/lib/ai-engine';

type Message = { role: 'user' | 'assistant'; content: string };

const AIAssistantPage = () => {
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const answer = getSmartAnswer(userMsg.content, schemes as any, lang);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setLoading(false);
    }, 200);
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    setIsListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => {
        const answer = getSmartAnswer(transcript, schemes as any, lang);
        setMessages(prev => [
          ...prev,
          { role: 'user', content: transcript },
          { role: 'assistant', content: answer },
        ]);
      }, 300);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const quickReplies = getQuickReplies(lang);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold">{t(lang, 'aiAssistant')}</h1>
          <p className="text-xs opacity-80">
            {lang === 'ta' ? 'குரலில் பேசவும் அல்லது தட்டச்சு செய்யவும்' : lang === 'tl' ? 'Kuralil pesavum allathu type seyyavum' : 'Speak or type your question'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-5xl mb-4">🤖</p>
            <p className="text-base text-muted-foreground mb-6">
              {lang === 'ta' ? 'அரசு திட்டங்கள் பற்றி கேளுங்கள்!' : lang === 'tl' ? 'Arasu thittangal patri kelungal!' : 'Ask about any government scheme!'}
            </p>
            {/* Quick reply buttons */}
            <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => send(qr)}
                  className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 active:scale-95 transition-all"
                >
                  {qr}
                </button>
              ))}
            </div>
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
            <div className="bg-muted p-3 rounded-lg rounded-bl-none text-muted-foreground text-sm animate-pulse">
              {lang === 'ta' ? 'யோசிக்கிறேன்...' : lang === 'tl' ? 'Yosikkiren...' : 'Thinking...'}
            </div>
          </div>
        )}
        {isListening && (
          <div className="flex justify-center">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              🎤 {t(lang, 'listening')}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies after conversation */}
      {messages.length > 0 && !loading && (
        <div className="px-3 pb-1 flex gap-2 overflow-x-auto shrink-0">
          {quickReplies.slice(0, 4).map((qr, i) => (
            <button
              key={i}
              onClick={() => send(qr)}
              className="px-3 py-1.5 bg-muted text-foreground rounded-full text-xs whitespace-nowrap hover:bg-muted/80 active:scale-95 transition-all"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border bg-background shrink-0 safe-bottom">
        <div className="flex gap-2">
          <button
            onClick={startVoice}
            className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-muted'}`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
          </button>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={t(lang, 'askQuestion')}
            className="flex-1 h-12"
          />
          <button onClick={() => send()} className="p-3 bg-primary text-primary-foreground rounded-lg">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
