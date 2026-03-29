import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getSmartAnswer, getQuickReplies } from '@/lib/ai-engine';
import { supabase } from '@/integrations/supabase/client';

type Message = { role: 'user' | 'assistant'; content: string };

// Browser TTS
function speakText(text: string, lang: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const clean = text
    .replace(/\*\*/g, '')
    .replace(/[📌📋📄✅💰🔗📊🔍❓🙏🔥📝📎🎁👤🌾🎓👩🏥🏠👴🤖\-]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n+/g, '. ')
    .trim();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
  utter.rate = 0.9;
  utter.pitch = 1;
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
  const [voiceMode, setVoiceMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const check = setInterval(() => {
      if ('speechSynthesis' in window) setIsSpeaking(window.speechSynthesis.speaking);
    }, 200);
    return () => { clearInterval(check); stopSpeaking(); };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Try cloud AI, fallback to local
  const getAIResponse = useCallback(async (msg: string, history: Message[]): Promise<string> => {
    // Always get local answer as fallback
    const localAnswer = getSmartAnswer(msg, schemes as any, lang);

    if (!navigator.onLine) return localAnswer;

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: msg,
          lang,
          history: history.slice(-6), // last 6 messages for context
          localAnswer, // send local answer so AI can enhance it
        },
      });

      if (error) throw error;
      return data?.answer || localAnswer;
    } catch {
      return localAnswer;
    }
  }, [schemes, lang]);

  const handleAssistantResponse = useCallback((answer: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    setLoading(false);
    if (autoSpeak) speakText(answer, lang);

    // In voice mode, auto-restart listening after speaking finishes
    if (voiceMode) {
      const waitForSpeech = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(waitForSpeech);
          setTimeout(() => startContinuousListening(), 500);
        }
      }, 300);
    }
  }, [autoSpeak, lang, voiceMode]);

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    stopSpeaking();
    const userMsg: Message = { role: 'user', content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const answer = await getAIResponse(msg, updatedMessages);
    handleAssistantResponse(answer);
  }, [input, loading, messages, getAIResponse, handleAssistantResponse]);

  // Continuous listening for voice-first mode
  const startContinuousListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    stopSpeaking();

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const rec = new SR();
    rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    recognitionRef.current = rec;
    setIsListening(true);

    rec.onresult = async (e: any) => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      setInput('');

      const userMsg: Message = { role: 'user', content: transcript };
      const updatedMessages = [...messages, userMsg];
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);

      const answer = await getAIResponse(transcript, updatedMessages);
      handleAssistantResponse(answer);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => {
      if (!voiceMode) setIsListening(false);
    };
    rec.start();
  }, [lang, messages, getAIResponse, handleAssistantResponse, voiceMode]);

  const startVoice = () => {
    if (isListening) {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
      return;
    }
    startContinuousListening();
  };

  const toggleVoiceMode = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    if (newMode) {
      setAutoSpeak(true);
      startContinuousListening();
    } else {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
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
            {voiceMode
              ? (lang === 'ta' ? '🎤 குரல் முறை இயக்கத்தில்' : lang === 'tl' ? '🎤 Kural murai iyakkathil' : '🎤 Voice mode active')
              : (lang === 'ta' ? 'குரலில் பேசவும் • பதில் படிக்கப்படும்' : lang === 'tl' ? 'Kuralil pesavum • Padhil padikkpadum' : 'Speak or type • Answers read aloud')
            }
          </p>
        </div>
        <button
          onClick={toggleVoiceMode}
          className={`p-2 rounded-lg transition-colors mr-1 ${voiceMode ? 'bg-green-500/30 ring-2 ring-green-400' : 'bg-primary-foreground/10'}`}
          title={voiceMode ? 'Voice mode ON' : 'Voice mode OFF'}
        >
          <Mic className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            setAutoSpeak(!autoSpeak);
            if (isSpeaking) stopSpeaking();
          }}
          className={`p-2 rounded-lg transition-colors ${autoSpeak ? 'bg-primary-foreground/20' : 'bg-primary-foreground/10 opacity-60'}`}
        >
          {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            {voiceMode ? (
              <>
                <p className="text-6xl mb-4 animate-pulse">🎤</p>
                <p className="text-lg font-bold text-primary mb-2">
                  {lang === 'ta' ? 'பேசுங்கள்...' : lang === 'tl' ? 'Pesungal...' : 'Speak now...'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lang === 'ta' ? 'உங்கள் கேள்வியை தமிழில் பேசுங்கள்' : lang === 'tl' ? 'Ungal kelviyai Tamilil pesungal' : 'Ask your question in Tamil or English'}
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
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

      {messages.length > 0 && !loading && !voiceMode && (
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
        {voiceMode ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={startVoice}
              className={`p-6 rounded-full transition-all ${isListening ? 'bg-destructive text-destructive-foreground animate-pulse scale-110' : 'bg-primary text-primary-foreground hover:scale-105'}`}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>
            <p className="text-xs text-muted-foreground">
              {isListening
                ? (lang === 'ta' ? 'கேட்கிறேன்... பேசுங்கள்' : lang === 'tl' ? 'Ketkiren... pesungal' : 'Listening... speak now')
                : (lang === 'ta' ? 'பேச தட்டவும்' : lang === 'tl' ? 'Pesa thattavum' : 'Tap to speak')
              }
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AIAssistantPage;
