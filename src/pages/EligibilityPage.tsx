import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes, SchemeData } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, ChevronRight, TrendingUp, Star, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SchemeCard from '@/components/SchemeCard';

type Profile = {
  age: string | null;
  gender: string | null;
  occupation: string | null;
  income: string | null;
  bpl: boolean | null;
  landOwner: boolean | null;
  caste: string | null;
  education: string | null;
};

type ScoredScheme = {
  scheme: SchemeData;
  score: number;
  probability: number;
  priority: 'high' | 'medium' | 'low';
};

const EligibilityPage = () => {
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    age: null, gender: null, occupation: null, income: null, bpl: null, landOwner: null, caste: null, education: null,
  });
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const set = (key: keyof Profile, val: any) => setProfile(prev => ({ ...prev, [key]: val }));

  const getScored = useMemo(() => {
    if (!showResults) return [];

    const results: ScoredScheme[] = [];

    for (const s of schemes) {
      let score = 0;
      let maxScore = 20; // approximate max possible score

      // Occupation match (weight: 4)
      if (profile.occupation === 'farmer' && s.category === 'farmer') score += 4;
      if (profile.occupation === 'student' && s.category === 'student') score += 4;
      if (profile.occupation === 'worker' && ['employment', 'rural'].includes(s.category)) score += 3;
      if (profile.occupation === 'unemployed' && ['employment', 'rural'].includes(s.category)) score += 3;
      if (profile.occupation === 'business' && s.category === 'employment') score += 3;
      if (profile.occupation === 'housewife' && s.category === 'women') score += 3;

      // Gender match (weight: 3)
      if (profile.gender === 'female' && s.category === 'women') score += 4;
      if (profile.gender === 'female' && ['children', 'health'].includes(s.category)) score += 1;

      // Age match (weight: 3)
      if (profile.age === '60+' && s.category === 'pension') score += 4;
      if (profile.age === 'below18' && s.category === 'children') score += 4;
      if (profile.age === 'below18' && s.category === 'student') score += 2;
      if (profile.age === '18-35' && s.category === 'student') score += 2;
      if (profile.age === '18-35' && s.category === 'employment') score += 1;

      // BPL match (weight: 3)
      if (profile.bpl && ['health', 'housing', 'pension', 'food', 'women', 'children'].includes(s.category)) score += 3;

      // Income match (weight: 2)
      if (profile.income === 'below5k' && ['health', 'pension', 'housing', 'food', 'women'].includes(s.category)) score += 3;
      if (profile.income === 'below10k' && ['health', 'food', 'housing'].includes(s.category)) score += 2;

      // Land owner - farmer schemes (weight: 2)
      if (profile.landOwner && s.category === 'farmer') score += 3;
      if (!profile.landOwner && s.category === 'rural') score += 1;

      // Caste-based matching (weight: 3)
      if (profile.caste === 'sc' || profile.caste === 'st') {
        if (['student', 'housing', 'employment', 'women'].includes(s.category)) score += 3;
        // SC/ST get higher probability on most welfare schemes
        score += 1;
      }
      if (profile.caste === 'obc' || profile.caste === 'mbc') {
        if (['student', 'employment'].includes(s.category)) score += 2;
      }

      // Education match (weight: 2)
      if (profile.education === 'none' || profile.education === 'primary') {
        if (['rural', 'food', 'pension', 'health'].includes(s.category)) score += 2;
      }
      if (profile.education === 'school' && s.category === 'student') score += 2;
      if (profile.education === 'college' && s.category === 'student') score += 3;

      // Universal schemes always get some score
      if (['food', 'health', 'special'].includes(s.category)) score += 1;

      if (score >= 2) {
        const probability = Math.min(95, Math.round((score / maxScore) * 100));
        const priority: 'high' | 'medium' | 'low' = probability >= 70 ? 'high' : probability >= 40 ? 'medium' : 'low';
        results.push({ scheme: s, score, probability, priority });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }, [showResults, schemes, profile]);

  const labels: Record<string, Record<string, string>> = {
    age: { en: 'What is your age group?', ta: 'உங்கள் வயது என்ன?', tl: 'Ungal vayathu enna?' },
    gender: { en: 'What is your gender?', ta: 'உங்கள் பாலினம்?', tl: 'Ungal paalinam?' },
    caste: { en: 'What is your community/caste?', ta: 'உங்கள் சாதி/சமூகம்?', tl: 'Ungal jaathi/samuugam?' },
    occupation: { en: 'What is your occupation?', ta: 'உங்கள் தொழில் என்ன?', tl: 'Ungal thozhil enna?' },
    education: { en: 'What is your education level?', ta: 'உங்கள் கல்வி நிலை?', tl: 'Ungal kalvi nilai?' },
    income: { en: 'Monthly family income?', ta: 'மாத குடும்ப வருமானம்?', tl: 'Maadha kudumba varumanam?' },
    bpl: { en: 'Is your family BPL?', ta: 'உங்கள் குடும்பம் BPL ஆ?', tl: 'Ungal kudumbam BPL a?' },
    landOwner: { en: 'Do you own agricultural land?', ta: 'உங்களுக்கு விவசாய நிலம் உள்ளதா?', tl: 'Ungalukku vivasaya nilam ulladha?' },
  };

  const options: Record<string, { value: string; en: string; ta: string; tl: string }[]> = {
    age: [
      { value: 'below18', en: 'Below 18', ta: '18 வயதிற்கு கீழ்', tl: '18 vayathirku keel' },
      { value: '18-35', en: '18-35 years', ta: '18-35 வயது', tl: '18-35 vayathu' },
      { value: '36-59', en: '36-59 years', ta: '36-59 வயது', tl: '36-59 vayathu' },
      { value: '60+', en: '60+ years', ta: '60+ வயது', tl: '60+ vayathu' },
    ],
    gender: [
      { value: 'male', en: 'Male', ta: 'ஆண்', tl: 'Aan' },
      { value: 'female', en: 'Female', ta: 'பெண்', tl: 'Penn' },
      { value: 'other', en: 'Other', ta: 'மற்றவை', tl: 'Matrravai' },
    ],
    caste: [
      { value: 'sc', en: 'SC (Scheduled Caste)', ta: 'SC (ஆதி திராவிடர்)', tl: 'SC (Aadhi Dravidar)' },
      { value: 'st', en: 'ST (Scheduled Tribe)', ta: 'ST (பழங்குடி)', tl: 'ST (Pazhangudi)' },
      { value: 'mbc', en: 'MBC (Most Backward)', ta: 'MBC (மிகவும் பிற்படுத்தப்பட்டோர்)', tl: 'MBC (Migavum Pirpaduthappattoor)' },
      { value: 'obc', en: 'OBC (Backward Class)', ta: 'OBC (பிற்படுத்தப்பட்டோர்)', tl: 'OBC (Pirpaduthappattoor)' },
      { value: 'general', en: 'General / Others', ta: 'பொது / மற்றவை', tl: 'Podhu / Matrravai' },
    ],
    occupation: [
      { value: 'farmer', en: '🌾 Farmer', ta: '🌾 விவசாயி', tl: '🌾 Vivasayi' },
      { value: 'student', en: '🎓 Student', ta: '🎓 மாணவர்', tl: '🎓 Maanavar' },
      { value: 'worker', en: '👷 Daily Worker', ta: '👷 தினசரி தொழிலாளி', tl: '👷 Thinasari Thozhilaali' },
      { value: 'unemployed', en: '🔍 Unemployed', ta: '🔍 வேலையில்லாதவர்', tl: '🔍 Velaiyillaathavar' },
      { value: 'business', en: '💼 Business/Self-employed', ta: '💼 தொழில்/சுயதொழில்', tl: '💼 Thozhil/Suyathozhil' },
      { value: 'housewife', en: '🏠 Homemaker', ta: '🏠 இல்லத்தரசி', tl: '🏠 Illatharasi' },
    ],
    education: [
      { value: 'none', en: '📖 No formal education', ta: '📖 படிப்பு இல்லை', tl: '📖 Padippu illai' },
      { value: 'primary', en: '📗 Primary (1-5)', ta: '📗 தொடக்கநிலை (1-5)', tl: '📗 Thodakka nilai (1-5)' },
      { value: 'school', en: '📘 School (6-12)', ta: '📘 பள்ளி (6-12)', tl: '📘 Palli (6-12)' },
      { value: 'college', en: '🎓 College/University', ta: '🎓 கல்லூரி', tl: '🎓 Kalloori' },
    ],
    income: [
      { value: 'below5k', en: 'Below ₹5,000', ta: '₹5,000க்கு கீழ்', tl: '₹5,000kku keel' },
      { value: 'below10k', en: '₹5,000 - ₹10,000', ta: '₹5,000 - ₹10,000', tl: '₹5,000 - ₹10,000' },
      { value: 'above10k', en: 'Above ₹10,000', ta: '₹10,000க்கு மேல்', tl: '₹10,000kku mel' },
    ],
  };

  const steps = ['age', 'gender', 'caste', 'occupation', 'education', 'income', 'bpl', 'landOwner'];
  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleSelect = (key: string, value: any) => {
    set(key as keyof Profile, value);
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  const priorityColors = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  const priorityLabels = {
    high: { en: 'High Priority', ta: 'உயர் முன்னுரிமை', tl: 'Uyar Munnurimai' },
    medium: { en: 'Medium Priority', ta: 'நடுத்தர முன்னுரிமை', tl: 'Naduthara Munnurimai' },
    low: { en: 'Low Priority', ta: 'குறைந்த முன்னுரிமை', tl: 'Kuraintha Munnurimai' },
  };

  const highCount = getScored.filter(s => s.priority === 'high').length;
  const medCount = getScored.filter(s => s.priority === 'medium').length;

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => { if (showResults) { setShowResults(false); setStep(0); } else if (step > 0) setStep(step - 1); else navigate(-1); }} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">{t(lang, 'eligibilityChecker')}</h1>
      </div>

      <div className="p-4">
        {!showResults ? (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{lang === 'ta' ? `கேள்வி ${step + 1}/${steps.length}` : lang === 'tl' ? `Kelvi ${step + 1}/${steps.length}` : `Question ${step + 1}/${steps.length}`}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-lg font-bold text-foreground mb-4">
              {labels[currentStep]?.[lang] || labels[currentStep]?.en}
            </h2>

            {/* Options */}
            {currentStep === 'bpl' || currentStep === 'landOwner' ? (
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => handleSelect(currentStep, val)}
                    className={`p-4 rounded-xl border-2 text-center text-base font-bold transition-all active:scale-95 ${
                      profile[currentStep as keyof Profile] === val
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground'
                    }`}
                  >
                    {val ? t(lang, 'yes') : t(lang, 'no')}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {options[currentStep]?.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(currentStep, opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-base font-medium transition-all active:scale-[0.98] flex items-center justify-between ${
                      profile[currentStep as keyof Profile] === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground'
                    }`}
                  >
                    <span>{opt[lang as keyof typeof opt] || opt.en}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Find Schemes button (show on last step) */}
            {step === steps.length - 1 && profile.landOwner !== null && (
              <Button onClick={() => setShowResults(true)} className="w-full h-12 mt-6 text-base">
                {t(lang, 'findSchemes')} →
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <Star className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700">{highCount}</p>
                <p className="text-xs text-green-600">{lang === 'ta' ? 'உயர்' : lang === 'tl' ? 'Uyar' : 'High'}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <TrendingUp className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-yellow-700">{medCount}</p>
                <p className="text-xs text-yellow-600">{lang === 'ta' ? 'நடுத்தர' : lang === 'tl' ? 'Naduthara' : 'Medium'}</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <Percent className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-primary">{getScored.length}</p>
                <p className="text-xs text-muted-foreground">{lang === 'ta' ? 'மொத்தம்' : lang === 'tl' ? 'Motham' : 'Total'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">{t(lang, 'recommendedSchemes')}</h2>
              <Button variant="outline" size="sm" onClick={() => { setShowResults(false); setStep(0); }}>
                {lang === 'ta' ? 'மீண்டும்' : lang === 'tl' ? 'Meendum' : 'Retry'}
              </Button>
            </div>

            {getScored.length > 0 ? (
              <div className="space-y-3">
                {getScored.map(({ scheme, probability, priority }) => (
                  <div key={scheme.id} className="relative">
                    {/* Priority & Probability Badge */}
                    <div className="flex gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityColors[priority]}`}>
                        {priorityLabels[priority][lang] || priorityLabels[priority].en}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {probability}% {lang === 'ta' ? 'வாய்ப்பு' : lang === 'tl' ? 'Vaippu' : 'likely'}
                      </span>
                    </div>
                    <SchemeCard scheme={scheme} lang={lang} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{t(lang, 'noResults')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityPage;
