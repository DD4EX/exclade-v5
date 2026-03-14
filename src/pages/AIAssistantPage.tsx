import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getSmartAnswer, getQuickReplies } from '@/lib/ai-engine';

type Message = { role: 'user' | 'assistant'; content: string };

// Browser TTS - reads text aloud for people who can't read
function speakText(text: string, lang: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  // Clean markdown formatting for speech
  const clean = text
    .replace(/\*\*/g, '')
    .replace(/[📌📋📄✅💰🔗📊🔍❓🙏🔥📝📎🎁👤🌾🎓👩🏥🏠👴🤖---]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
  utter.rate = 0.9;
  utter.pitch = 1;
  
  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const targetLang = lang === 'ta' ? 'ta' : 'en';
  const match = voices.find(v => v.lang.startsWith(targetLang));
  if (match) utter.voice = match;

  window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

const AIAssistantPage = () => {
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track speaking state
  useEffect(() => {
    const check = setInterval(() => {
      if ('speechSynthesis' in window) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    }, 200);
    return () => {
      clearInterval(check);
      stopSpeaking();
    };
  }, []);

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const handleAssistantResponse = useCallback((answer: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    setLoading(false);
    if (autoSpeak) speakText(answer, lang);
  }, [autoSpeak, lang]);

  const send = useCallback((text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    stopSpeaking();
    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const answer = getSmartAnswer(msg, schemes as any, lang);
      handleAssistantResponse(answer);
    }, 200);
  }, [input, loading, schemes, lang, handleAssistantResponse]);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    stopSpeaking();
    const rec = new SR();
    rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    setIsListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setTimeout(() => {
        const answer = getSmartAnswer(transcript, schemes as any, lang);
        setMessages(prev => [
          ...prev,
          { role: 'user', content: transcript },
          { role: 'assistant', content: answer },
        ]);
        if (autoSpeak) speakText(answer, lang);
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
        <div className="flex-1">
          <h1 className="text-lg font-bold">{t(lang, 'aiAssistant')}</h1>
          <p className="text-xs opacity-80">
            {lang === 'ta' ? 'குரலில் பேசவும் • பதில் படிக்கப்படும்' : lang === 'tl' ? 'Kuralil pesavum • Padhil padikkpadum' : 'Speak or type • Answers read aloud'}
          </p>
        </div>
        <button
          onClick={() => {
            setAutoSpeak(!autoSpeak);
            if (isSpeaking) stopSpeaking();
          }}
          className={`p-2 rounded-lg transition-colors ${autoSpeak ? 'bg-primary-foreground/20' : 'bg-primary-foreground/10 opacity-60'}`}
          title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
        >
          {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-5xl mb-4">🤖</p>
            <p className="text-base text-muted-foreground mb-2">
              {lang === 'ta' ? 'அரசு திட்டங்கள் பற்றி கேளுங்கள்!' : lang === 'tl' ? 'Arasu thittangal patri kelungal!' : 'Ask about any government scheme!'}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              {lang === 'ta' ? '🔊 பதில்கள் தானாக படிக்கப்படும்' : lang === 'tl' ? '🔊 Padhilgal thaanaga padikkappadum' : '🔊 Answers are read aloud automatically'}
            </p>
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
              {msg.role === 'assistant' && (
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else speakText(msg.content, lang);
                  }}
                  className="ml-2 inline-flex items-center text-primary hover:text-primary/80"
                  title={isSpeaking ? 'Stop' : 'Read aloud'}
                >
                  {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              )}
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
