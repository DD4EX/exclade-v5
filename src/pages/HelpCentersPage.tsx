import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';

const HelpCentersPage = () => {
  const { lang } = useLanguage();
  const { helpCenters } = useSchemes();
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">{t(lang, 'helpCenters')}</h1>
      </div>

      <div className="p-4">
        <h2 className="text-base font-bold mb-4">{t(lang, 'nearbyOffices')}</h2>
        <div className="space-y-3">
          {helpCenters.map(center => {
            const data = center[lang as keyof typeof center] as { name: string; address: string };
            return (
              <div key={center.id} className="bg-card p-4 rounded-lg border border-border">
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {data.name}
                </h3>
                <p className="text-sm text-muted-foreground ml-7 mb-3">{data.address}</p>
                <a
                  href={center.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-7 inline-flex items-center gap-1 text-sm text-primary font-semibold"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t(lang, 'openMap')}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HelpCentersPage;
