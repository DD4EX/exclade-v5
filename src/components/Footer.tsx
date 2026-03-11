import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/i18n';

const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-card border-t border-border p-6 pb-20 text-center">
      <h3 className="font-bold text-foreground mb-1">{t(lang, 'appTitle')}</h3>
      <p className="text-sm text-foreground mb-1">{t(lang, 'appSubtitle')}</p>
      <p className="text-xs text-muted-foreground mb-3">{t(lang, 'footerText')}</p>

      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>Created by: <strong>{t(lang, 'devName')}</strong> [{t(lang, 'devCommunity')}]</p>
        <p>{t(lang, 'devVillage')}, {t(lang, 'devTaluk')}</p>
        <p>{t(lang, 'devDistrict')}, {t(lang, 'devState')}</p>
        <a href="https://duraib.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary">
          duraib.vercel.app
        </a>
      </div>

      <p className="text-[10px] text-muted-foreground mt-4">{t(lang, 'disclaimer')}</p>
    </footer>
  );
};

export default Footer;
