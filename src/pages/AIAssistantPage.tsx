import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, Send, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

  const getLocalAnswer = (query: string): string => {
    const q = query.toLowerCase();
    const matchedSchemes = schemes.filter(s => {
      const d = s[lang as keyof typeof s] as any;
      return d?.name?.toLowerCase().includes(q) ||
        d?.description?.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
    });

    if (matchedSchemes.length > 0) {
      const langKey = lang as 'en' | 'ta' | 'tl';
      return matchedSchemes.map(s => {
        const d = s[langKey];
        return `**${d.name}**\n${d.description}\n\n${t(lang, 'benefits')}: ${d.benefits}\n${t(lang, 'status')}: ${s.status}`;
      }).join('\n\n---\n\n');
    }

    // Check for keywords
    const keywords: Record<string, string[]> = {
      farmer: ['farmer', 'vivasayi', 'விவசாயி', 'farm', 'agriculture', 'crop', 'payir'],
      student: ['student', 'maanavar', 'மாணவர்', 'school', 'college', 'laptop', 'scholarship'],
      women: ['women', 'pengal', 'பெண்', 'woman', 'maternity', 'widow', 'magalir'],
      health: ['health', 'sugaathara', 'சுகாதார', 'hospital', 'medical', 'insurance'],
      housing: ['house', 'veedu', 'வீடு', 'housing', 'awas', 'home'],
      pension: ['pension', 'oivuthiyam', 'ஓய்வூதியம்', 'senior', 'old age', 'muthiyor'],
    };

    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(w => q.includes(w))) {
        const catSchemes = schemes.filter(s => s.category === cat);
        if (catSchemes.length > 0) {
          const langKey = lang as 'en' | 'ta' | 'tl';
          return catSchemes.map(s => {
            const d = s[langKey];
            return `**${d.name}** - ${d.description}`;
          }).join('\n\n');
        }
      }
    }

    const allNames = schemes.map(s => {
      const d = s[lang as 'en' | 'ta' | 'tl'];
      return `• ${d.name}`;
    }).join('\n');

    return lang === 'ta'
      ? `உங்கள் கேள்விக்கு நேரடி பொருத்தம் கிடைக்கவில்லை. இங்கு உள்ள அனைத்து திட்டங்கள்:\n\n${allNames}`
      : lang === 'tl'
      ? `Ungal kelvikku neradi porutham kidaikkavaillai. Ingu ulla anaithu thittangal:\n\n${allNames}`
      : `I couldn't find an exact match. Here are all available schemes:\n\n${allNames}`;
  };

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const answer = getLocalAnswer(userMsg.content);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setLoading(false);
    }, 500);
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
