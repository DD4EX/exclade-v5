import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, ExternalLink, CheckCircle, FileText, ListOrdered, Volume2, VolumeX, Square, CheckSquare, MapPin, CircleDot, Circle } from 'lucide-react';
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
  const match = voices.find(v => v.lang.startsWith(lang === 'ta' ? 'ta' : 'en'));
  if (match) utter.voice = match;
  window.speechSynthesis.speak(utter);
}

const ReadAloudButton = ({ text, lang }: { text: string; lang: string }) => {
  const [speaking, setSpeaking] = useState(false);
  const toggle = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); }
    else {
      speakSection(text, lang); setSpeaking(true);
      const check = setInterval(() => { if (!window.speechSynthesis.speaking) { setSpeaking(false); clearInterval(check); } }, 200);
    }
  };
  return (
    <button onClick={toggle} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
      {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
};

// Nearest offices data for each scheme category
const nearestOffices: Record<string, { en: string; ta: string; tl: string; map: string }[]> = {
  farmer: [
    { en: 'Agriculture Office, Virudhachalam', ta: 'வேளாண் அலுவலகம், விருத்தாசலம்', tl: 'Velaan Aluvagalam, Virudhachalam', map: 'https://maps.google.com/?q=Agriculture+Office+Virudhachalam' },
    { en: 'Taluk Office, Virudhachalam', ta: 'தாலுகா அலுவலகம், விருத்தாசலம்', tl: 'Thaluka Aluvagalam, Virudhachalam', map: 'https://maps.google.com/?q=Taluk+Office+Virudhachalam' },
  ],
  student: [
    { en: 'District Education Office, Cuddalore', ta: 'மாவட்ட கல்வி அலுவலகம், கடலூர்', tl: 'Maavatta Kalvi Aluvagalam, Cuddalore', map: 'https://maps.google.com/?q=District+Education+Office+Cuddalore' },
  ],
  women: [
    { en: 'Social Welfare Office, Virudhachalam', ta: 'சமூக நலத்துறை அலுவலகம், விருத்தாசலம்', tl: 'Samuga Nalatthurai Aluvagalam, Virudhachalam', map: 'https://maps.google.com/?q=Social+Welfare+Office+Virudhachalam' },
  ],
  health: [
    { en: 'PHC, Virudhachalam', ta: 'ஆரம்ப சுகாதார நிலையம், விருத்தாசலம்', tl: 'Aaramba Sugaathara Nilaiyam, Virudhachalam', map: 'https://maps.google.com/?q=Primary+Health+Centre+Virudhachalam' },
    { en: 'Govt Hospital, Cuddalore', ta: 'அரசு மருத்துவமனை, கடலூர்', tl: 'Arasu Maruththuvamanai, Cuddalore', map: 'https://maps.google.com/?q=Government+Hospital+Cuddalore' },
  ],
  housing: [
    { en: 'Panchayat Office, A. Chithur', ta: 'பஞ்சாயத்து அலுவலகம், அ. சித்தூர்', tl: 'Panchayathu Aluvagalam, A. Chithur', map: 'https://maps.google.com/?q=Panchayat+Office+Chithur+Virudhachalam' },
    { en: 'Collector Office, Cuddalore', ta: 'மாவட்ட ஆட்சியர் அலுவலகம், கடலூர்', tl: 'Maavatta Aatchiyar Aluvagalam, Cuddalore', map: 'https://maps.google.com/?q=Collector+Office+Cuddalore' },
  ],
  pension: [
    { en: 'Taluk Office, Virudhachalam', ta: 'தாலுகா அலுவலகம், விருத்தாசலம்', tl: 'Thaluka Aluvagalam, Virudhachalam', map: 'https://maps.google.com/?q=Taluk+Office+Virudhachalam' },
  ],
  rural: [
    { en: 'Block Development Office, Virudhachalam', ta: 'வட்டார வளர்ச்சி அலுவலகம், விருத்தாசலம்', tl: 'Vattara Valarchi Aluvagalam, Virudhachalam', map: 'https://maps.google.com/?q=Block+Development+Office+Virudhachalam' },
  ],
  employment: [
    { en: 'Employment Exchange, Cuddalore', ta: 'வேலைவாய்ப்பு அலுவலகம், கடலூர்', tl: 'Velaivaaippu Aluvagalam, Cuddalore', map: 'https://maps.google.com/?q=Employment+Exchange+Cuddalore' },
  ],
  children: [
    { en: 'ICDS Office, Virudhachalam', ta: 'ICDS அலுவலகம், விருத்தாசலம்', tl: 'ICDS Aluvagalam, Virudhachalam', map: 'https://maps.google.com/?q=ICDS+Office+Virudhachalam' },
  ],
  food: [
    { en: 'Ration Shop, A. Chithur', ta: 'ரேஷன் கடை, அ. சித்தூர்', tl: 'Ration Kadai, A. Chithur', map: 'https://maps.google.com/?q=Ration+Shop+Chithur+Virudhachalam' },
    { en: 'Civil Supplies Office, Cuddalore', ta: 'உணவுப் பொருள் வழங்கல் அலுவலகம், கடலூர்', tl: 'Unavup Porul Vazhangal Aluvagalam, Cuddalore', map: 'https://maps.google.com/?q=Civil+Supplies+Office+Cuddalore' },
  ],
  special: [
    { en: 'Collector Office, Cuddalore', ta: 'மாவட்ட ஆட்சியர் அலுவலகம், கடலூர்', tl: 'Maavatta Aatchiyar Aluvagalam, Cuddalore', map: 'https://maps.google.com/?q=Collector+Office+Cuddalore' },
  ],
};

const SchemeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const scheme = schemes.find(s => s.id === id);
  if (!scheme) return <div className="p-4">{t(lang, 'noResults')}</div>;

  const data = scheme[lang as keyof typeof scheme] as any;

  const toggleDoc = (i: number) => {
    setCheckedDocs(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  };
  const toggleStep = (i: number) => {
    setCompletedSteps(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  };

  const allDocsChecked = data.documents.length > 0 && checkedDocs.size === data.documents.length;
  const offices = nearestOffices[scheme.category] || nearestOffices.special || [];
  const stepProgress = data.steps.length > 0 ? Math.round((completedSteps.size / data.steps.length) * 100) : 0;

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
              <span className="text-xs text-muted-foreground">({checkedDocs.size}/{data.documents.length})</span>
            </h3>
            <ReadAloudButton text={data.documents.join('. ')} lang={lang} />
          </div>
          {allDocsChecked && (
            <div className="bg-green-50 text-green-700 text-sm font-medium p-2 rounded-lg mb-2 text-center border border-green-200">
              {lang === 'ta' ? '✅ அனைத்து ஆவணங்களும் தயாராக உள்ளன!' : lang === 'tl' ? '✅ Anaithu aavaningalum thayaaraga ullana!' : '✅ All documents ready!'}
            </div>
          )}
          <ul className="space-y-2">
            {data.documents.map((d: string, i: number) => (
              <li key={i}>
                <button onClick={() => toggleDoc(i)} className={`w-full flex items-center gap-3 text-sm p-3 rounded-lg border transition-all text-left ${checkedDocs.has(i) ? 'bg-green-50 border-green-200 text-foreground' : 'bg-card border-border text-foreground'}`}>
                  {checkedDocs.has(i) ? <CheckSquare className="h-5 w-5 text-green-600 shrink-0" /> : <Square className="h-5 w-5 text-muted-foreground shrink-0" />}
                  <span className={checkedDocs.has(i) ? 'line-through opacity-70' : ''}>{d}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Steps with Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <ListOrdered className="h-5 w-5" /> {t(lang, 'howToApply')}
            </h3>
            <ReadAloudButton text={data.steps.join('. ')} lang={lang} />
          </div>
          {/* Progress bar */}
          {data.steps.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{lang === 'ta' ? 'முன்னேற்றம்' : lang === 'tl' ? 'Munnetram' : 'Progress'}</span>
                <span>{stepProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${stepProgress}%` }} />
              </div>
            </div>
          )}
          <ol className="space-y-3">
            {data.steps.map((s: string, i: number) => (
              <li key={i}>
                <button onClick={() => toggleStep(i)} className="w-full flex items-start gap-3 text-sm text-left">
                  <span className={`rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${completedSteps.has(i) ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                    {completedSteps.has(i) ? '✓' : i + 1}
                  </span>
                  <span className={`pt-1 ${completedSteps.has(i) ? 'line-through opacity-60' : ''}`}>{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Nearest Offices */}
        {offices.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              {lang === 'ta' ? 'அருகிலுள்ள அலுவலகங்கள்' : lang === 'tl' ? 'Arugilulla Aluvagalangal' : 'Nearest Offices'}
            </h3>
            <div className="space-y-2">
              {offices.map((office, i) => (
                <a
                  key={i}
                  href={office.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                >
                  {i === 0 ? <CircleDot className="h-5 w-5 text-green-600 shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                  <span className="text-sm font-medium text-foreground flex-1">{office[lang as keyof typeof office] as string || office.en}</span>
                  <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Official Source */}
        <a href={scheme.official_source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary underline text-sm">
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
