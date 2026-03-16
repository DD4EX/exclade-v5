import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes, SchemeData } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SchemeCard from '@/components/SchemeCard';

type Profile = {
  age: string | null;
  gender: string | null;
  occupation: string | null;
  income: string | null;
  bpl: boolean | null;
  landOwner: boolean | null;
};

const EligibilityPage = () => {
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    age: null, gender: null, occupation: null, income: null, bpl: null, landOwner: null,
  });
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const set = (key: keyof Profile, val: any) => setProfile(prev => ({ ...prev, [key]: val }));

  const getRecommended = (): SchemeData[] => {
    return schemes.filter(s => {
      let score = 0;
      // Occupation match
      if (profile.occupation === 'farmer' && s.category === 'farmer') score += 3;
      if (profile.occupation === 'student' && (s.category === 'student')) score += 3;
      if (profile.occupation === 'worker' && ['employment', 'rural'].includes(s.category)) score += 2;
      if (profile.occupation === 'unemployed' && ['employment', 'rural'].includes(s.category)) score += 2;
      if (profile.occupation === 'business' && s.category === 'employment') score += 2;
      // Gender match
      if (profile.gender === 'female' && s.category === 'women') score += 3;
      // Age match
      if (profile.age === '60+' && s.category === 'pension') score += 3;
      if (profile.age === 'below18' && s.category === 'children') score += 3;
      if (profile.age === '18-35' && s.category === 'student') score += 1;
      // BPL match
      if (profile.bpl && ['health', 'housing', 'pension', 'food', 'women'].includes(s.category)) score += 2;
      // Income match
      if (profile.income === 'below5k' && ['health', 'pension', 'housing', 'food'].includes(s.category)) score += 2;
      if (profile.income === 'below10k' && ['health', 'food'].includes(s.category)) score += 1;
      // Land owner - farmer schemes
      if (profile.landOwner && s.category === 'farmer') score += 2;
      // Universal schemes
      if (['food', 'health', 'special'].includes(s.category)) score += 1;
      return score >= 2;
    });
  };

  const labels: Record<string, Record<string, string>> = {
    age: { en: 'What is your age group?', ta: 'உங்கள் வயது என்ன?', tl: 'Ungal vayathu enna?' },
    gender: { en: 'What is your gender?', ta: 'உங்கள் பாலினம்?', tl: 'Ungal paalinam?' },
    occupation: { en: 'What is your occupation?', ta: 'உங்கள் தொழில் என்ன?', tl: 'Ungal thozhil enna?' },
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
    occupation: [
      { value: 'farmer', en: '🌾 Farmer', ta: '🌾 விவசாயி', tl: '🌾 Vivasayi' },
      { value: 'student', en: '🎓 Student', ta: '🎓 மாணவர்', tl: '🎓 Maanavar' },
      { value: 'worker', en: '👷 Daily Worker', ta: '👷 தினசரி தொழிலாளி', tl: '👷 Thinasari Thozhilaali' },
      { value: 'unemployed', en: '🔍 Unemployed', ta: '🔍 வேலையில்லாதவர்', tl: '🔍 Velaiyillaathavar' },
      { value: 'business', en: '💼 Business/Self-employed', ta: '💼 தொழில்/சுயதொழில்', tl: '💼 Thozhil/Suyathozhil' },
      { value: 'housewife', en: '🏠 Homemaker', ta: '🏠 இல்லத்தரசி', tl: '🏠 Illatharasi' },
    ],
    income: [
      { value: 'below5k', en: 'Below ₹5,000', ta: '₹5,000க்கு கீழ்', tl: '₹5,000kku keel' },
      { value: 'below10k', en: '₹5,000 - ₹10,000', ta: '₹5,000 - ₹10,000', tl: '₹5,000 - ₹10,000' },
      { value: 'above10k', en: 'Above ₹10,000', ta: '₹10,000க்கு மேல்', tl: '₹10,000kku mel' },
    ],
  };

  const steps = ['age', 'gender', 'occupation', 'income', 'bpl', 'landOwner'];
  const currentStep = steps[step];
  const recommended = showResults ? getRecommended() : [];
  const progress = ((step + 1) / steps.length) * 100;

  const handleSelect = (key: string, value: any) => {
    set(key as keyof Profile, value);
    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">{t(lang, 'recommendedSchemes')}</h2>
            </div>
            {recommended.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  {recommended.length} {t(lang, 'schemesFound')}
                </p>
                <div className="space-y-3">
                  {recommended.map(s => (
                    <SchemeCard key={s.id} scheme={s} lang={lang} />
                  ))}
                </div>
              </>
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
