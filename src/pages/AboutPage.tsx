import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';

const AboutPage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">{t(lang, 'about')}</h1>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">{t(lang, 'aboutTitle')}</h2>
          <p className="text-base text-muted-foreground leading-relaxed">{t(lang, 'aboutDesc')}</p>
        </div>

        <div className="bg-card p-5 rounded-lg border border-border">
          <h3 className="font-bold text-foreground mb-3">{t(lang, 'developer')}</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> <strong>{t(lang, 'devName')}</strong></p>
            <p><span className="text-muted-foreground">Community:</span> <strong>{t(lang, 'devCommunity')}</strong></p>
            <p><span className="text-muted-foreground">Village:</span> <strong>{t(lang, 'devVillage')}</strong></p>
            <p><span className="text-muted-foreground">Taluk:</span> <strong>{t(lang, 'devTaluk')}</strong></p>
            <p><span className="text-muted-foreground">District:</span> <strong>{t(lang, 'devDistrict')}</strong></p>
            <p><span className="text-muted-foreground">State:</span> <strong>{t(lang, 'devState')}</strong></p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://duraib.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold underline"
          >
            duraib.vercel.app
          </a>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {t(lang, 'disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
