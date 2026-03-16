import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, ExternalLink, CheckCircle, FileText, ListOrdered, Volume2, VolumeX, Square, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function speakSection(text: string, lang: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[📌📋📄✅💰🔗📊🔍❓🙏🔥📝📎🎁👤🌾🎓👩🏥🏠👴🤖\-]/g, '').replace(/\n+/g, '. ').trim();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
  utter.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const targetLang = lang === 'ta' ? 'ta' : 'en';
  const match = voices.find(v => v.lang.startsWith(targetLang));
  if (match) utter.voice = match;
  window.speechSynthesis.speak(utter);
}

const ReadAloudButton = ({ text, lang }: { text: string; lang: string }) => {
  const [speaking, setSpeaking] = useState(false);

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      speakSection(text, lang);
      setSpeaking(true);
      // Reset when done
      const check = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeaking(false);
          clearInterval(check);
        }
      }, 200);
    }
  };

  return (
    <button onClick={toggle} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title={speaking ? 'Stop' : 'Read aloud'}>
      {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
};

const SchemeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());

  const scheme = schemes.find(s => s.id === id);
  if (!scheme) return <div className="p-4">{t(lang, 'noResults')}</div>;

  const data = scheme[lang as keyof typeof scheme] as any;

  const toggleDoc = (i: number) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const allDocsChecked = data.documents.length > 0 && checkedDocs.size === data.documents.length;

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
        <div className="flex items-start justify-between gap-2">
          <p className="text-base text-foreground leading-relaxed flex-1">{data.description}</p>
          <ReadAloudButton text={data.description} lang={lang} />
        </div>

        {/* Benefits */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> {t(lang, 'benefits')}
            </h3>
            <ReadAloudButton text={data.benefits} lang={lang} />
          </div>
          <p className="text-base font-semibold text-foreground">{data.benefits}</p>
        </div>

        {/* Eligibility */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground">{t(lang, 'eligibility')}</h3>
            <ReadAloudButton text={data.eligibility.join('. ')} lang={lang} />
          </div>
          <ul className="space-y-2">
            {data.eligibility.map((e: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">✓</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" /> {t(lang, 'documents')}
            </h3>
            <ReadAloudButton text={data.documents.join('. ')} lang={lang} />
          </div>
          {allDocsChecked && (
            <div className="bg-primary/10 text-primary text-sm font-medium p-2 rounded-lg mb-2 text-center">
              {lang === 'ta' ? '✅ அனைத்து ஆவணங்களும் தயாராக உள்ளன!' : lang === 'tl' ? '✅ Anaithu aavaningalum thayaaraga ullana!' : '✅ All documents ready!'}
            </div>
          )}
          <ul className="space-y-2">
            {data.documents.map((d: string, i: number) => (
              <li key={i}>
                <button
                  onClick={() => toggleDoc(i)}
                  className={`w-full flex items-center gap-3 text-sm p-3 rounded-lg border transition-all text-left ${
                    checkedDocs.has(i) ? 'bg-primary/5 border-primary/30 text-foreground' : 'bg-card border-border text-foreground'
                  }`}
                >
                  {checkedDocs.has(i) ? (
                    <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <span className={checkedDocs.has(i) ? 'line-through opacity-70' : ''}>{d}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <ListOrdered className="h-5 w-5" /> {t(lang, 'howToApply')}
            </h3>
            <ReadAloudButton text={data.steps.join('. ')} lang={lang} />
          </div>
          <ol className="space-y-3">
            {data.steps.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="pt-1">{s}</span>
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
