import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/i18n';

const WelcomePage = () => {
  const { setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center animate-fade-in max-w-md w-full">
        <div className="text-6xl mb-4">🏛️</div>
        <h1 className="text-2xl font-bold text-primary mb-1">A. Chithur Village</h1>
        <h2 className="text-lg font-semibold text-foreground mb-2">Government Scheme Assistant</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Tamil Nadu → Cuddalore → Virudhachalam → A. Chithur
        </p>

        <p className="text-base font-medium text-foreground mb-4">Choose your language</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setLang('ta')}
            className="w-full py-4 px-6 text-xl font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95 transition-all font-tamil"
          >
            தமிழ்
          </button>
          <button
            onClick={() => setLang('tl')}
            className="w-full py-4 px-6 text-xl font-bold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 active:scale-95 transition-all"
          >
            Tanglish
          </button>
          <button
            onClick={() => setLang('en')}
            className="w-full py-4 px-6 text-xl font-bold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 active:scale-95 transition-all"
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
