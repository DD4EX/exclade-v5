import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes, SchemeData } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SchemeCard from '@/components/SchemeCard';

type Answers = {
  farmer: boolean | null;
  land: boolean | null;
  student: boolean | null;
  senior: boolean | null;
  woman: boolean | null;
  bpl: boolean | null;
  income: string | null;
};

const EligibilityPage = () => {
  const { lang } = useLanguage();
  const { schemes } = useSchemes();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({
    farmer: null, land: null, student: null, senior: null, woman: null, bpl: null, income: null,
  });
  const [showResults, setShowResults] = useState(false);

  const setAnswer = (key: keyof Answers, val: any) => setAnswers(prev => ({ ...prev, [key]: val }));

  const getRecommendedSchemes = (): SchemeData[] => {
    return schemes.filter(s => {
      if (answers.farmer && s.category === 'farmer') return true;
      if (answers.student && s.category === 'student') return true;
      if (answers.woman && s.category === 'women') return true;
      if (answers.senior && s.category === 'pension') return true;
      if (answers.bpl && ['housing', 'health', 'women', 'pension'].includes(s.category)) return true;
      if (answers.income === 'below5k' && ['health', 'pension', 'housing'].includes(s.category)) return true;
      return false;
    });
  };

  const recommended = showResults ? getRecommendedSchemes() : [];

  const QuestionRow = ({ label, qKey }: { label: string; qKey: keyof Answers }) => (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <span className="text-base font-medium pr-4">{label}</span>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setAnswer(qKey, true)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${answers[qKey] === true ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          {t(lang, 'yes')}
        </button>
        <button
          onClick={() => setAnswer(qKey, false)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${answers[qKey] === false ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          {t(lang, 'no')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">{t(lang, 'eligibilityChecker')}</h1>
      </div>

      <div className="p-4">
        {!showResults ? (
          <div className="space-y-1">
            <h2 className="text-base font-bold mb-4">{t(lang, 'findSchemes')}</h2>
            <QuestionRow label={t(lang, 'question_farmer')} qKey="farmer" />
            <QuestionRow label={t(lang, 'question_land')} qKey="land" />
            <QuestionRow label={t(lang, 'question_student')} qKey="student" />
            <QuestionRow label={t(lang, 'question_senior')} qKey="senior" />
            <QuestionRow label={t(lang, 'question_woman')} qKey="woman" />
            <QuestionRow label={t(lang, 'question_bpl')} qKey="bpl" />

            <div className="py-3 border-b border-border">
              <span className="text-base font-medium block mb-2">{t(lang, 'question_income')}</span>
              <div className="flex gap-2 flex-wrap">
                {(['below5k', 'below10k', 'above10k'] as const).map(val => (
                  <button
                    key={val}
                    onClick={() => setAnswer('income', val)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${answers.income === val ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  >
                    {t(lang, val)}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={() => setShowResults(true)} className="w-full h-12 mt-4 text-base">
              {t(lang, 'findSchemes')}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">{t(lang, 'recommendedSchemes')}</h2>
              <button onClick={() => setShowResults(false)} className="text-primary text-sm font-bold">
                {t(lang, 'back')}
              </button>
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
