import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, ExternalLink, CheckCircle, FileText, ListOrdered } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SchemeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();

  const scheme = schemes.find(s => s.id === id);
  if (!scheme) return <div className="p-4">{t(lang, 'noResults')}</div>;

  const data = scheme[lang as keyof typeof scheme] as any;

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold flex-1">{data.name}</h1>
      </div>

      <div className="p-4 space-y-5">
        {/* Status */}
        <div className="flex items-center gap-3">
          <Badge variant={scheme.status === 'Open' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
            {scheme.status === 'Open' ? t(lang, 'open') : t(lang, 'closed')}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {t(lang, 'lastUpdated')}: {scheme.last_updated}
          </span>
        </div>

        {/* Description */}
        <p className="text-base text-foreground leading-relaxed">{data.description}</p>

        {/* Benefits */}
        <div className="bg-village-green-light p-4 rounded-lg border border-primary/20">
          <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> {t(lang, 'benefits')}
          </h3>
          <p className="text-base font-semibold text-foreground">{data.benefits}</p>
        </div>

        {/* Eligibility */}
        <div>
          <h3 className="font-bold text-foreground mb-2">{t(lang, 'eligibility')}</h3>
          <ul className="space-y-2">
            {data.eligibility.map((e: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">✓</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents */}
        <div>
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" /> {t(lang, 'documents')}
          </h3>
          <ul className="space-y-1">
            {data.documents.map((d: string, i: number) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <ListOrdered className="h-5 w-5" /> {t(lang, 'howToApply')}
          </h3>
          <ol className="space-y-2">
            {data.steps.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Official Source */}
        <a
          href={scheme.official_source}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary underline text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          {t(lang, 'officialSource')}
        </a>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={() => navigate('/eligibility')} className="flex-1 h-12 text-base">
            {t(lang, 'checkEligibility')}
          </Button>
          <Button onClick={() => navigate('/ai')} variant="outline" className="flex-1 h-12 text-base">
            {t(lang, 'askAI')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailsPage;
