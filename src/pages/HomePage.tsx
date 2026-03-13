import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t, Language } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import SchemeCard from '@/components/SchemeCard';
import SyncBanner from '@/components/SyncBanner';
import { Search, Mic, MessageCircle } from 'lucide-react';

const HomePage = () => {
  const { lang } = useLanguage();
  const { schemes, categories, lastSynced, syncStatus, refreshFromCloud } = useSchemes();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const popularSchemes = useMemo(() => schemes.filter(s => s.popular), [schemes]);

  const filteredSchemes = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return schemes.filter(s => {
      const d = s[lang as keyof typeof s] as any;
      return d?.name?.toLowerCase().includes(q) || d?.description?.toLowerCase().includes(q);
    });
  }, [search, schemes, lang]);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.onresult = (e: any) => setSearch(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{t(lang, 'appTitle')}</h1>
            <p className="text-sm opacity-80">{t(lang, 'appSubtitle')}</p>
          </div>
          <button 
            onClick={refreshFromCloud}
            disabled={syncStatus === 'syncing'}
            className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {/* Sync status bar */}
        <div className="flex items-center gap-1.5 mt-2 text-xs opacity-70">
          {navigator.onLine ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}
          <span>
            {syncStatus === 'syncing' 
              ? (lang === 'ta' ? 'புதுப்பிக்கிறது...' : lang === 'tl' ? 'Pudhuppikkurathu...' : 'Syncing...')
              : lastSynced 
                ? `${lang === 'ta' ? 'கடைசி புதுப்பிப்பு' : lang === 'tl' ? 'Kadaisi pudhupippu' : 'Last sync'}: ${lastSynced}`
                : (lang === 'ta' ? 'உள்ளூர் தரவு' : lang === 'tl' ? 'Ulloor data' : 'Local data')}
          </span>
          <span className="ml-auto">{schemes.length} {lang === 'ta' ? 'திட்டங்கள்' : lang === 'tl' ? 'thittangal' : 'schemes'}</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t(lang, 'searchPlaceholder')}
            className="pl-10 pr-10 h-12 text-base"
          />
          <button onClick={startVoiceSearch} className="absolute right-3 top-3">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {search.trim() && (
        <div className="px-4 pb-4">
          {filteredSchemes.length > 0 ? (
            <div className="space-y-3">
              {filteredSchemes.map(s => (
                <SchemeCard key={s.id} scheme={s} lang={lang} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">{t(lang, 'noResults')}</p>
          )}
        </div>
      )}

      {/* Categories */}
      {!search.trim() && (
        <>
          <div className="px-4 pb-2">
            <h2 className="text-lg font-bold text-foreground mb-3">{t(lang, 'categories')}</h2>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="flex flex-col items-center p-4 bg-card rounded-lg border border-border hover:border-primary active:scale-95 transition-all"
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="text-xs font-semibold text-center text-card-foreground">
                    {cat[lang as keyof typeof cat] as string}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Schemes */}
          <div className="px-4 pt-4">
            <h2 className="text-lg font-bold text-foreground mb-3">{t(lang, 'popularSchemes')}</h2>
            <div className="space-y-3">
              {popularSchemes.map(s => (
                <SchemeCard key={s.id} scheme={s} lang={lang} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => navigate('/ai')}
        className="fixed bottom-24 right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transition-all z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default HomePage;
