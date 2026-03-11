import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { useSchemes } from '@/lib/schemes-context';
import { t } from '@/lib/i18n';
import SchemeCard from '@/components/SchemeCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { schemes, categories } = useSchemes();
  const navigate = useNavigate();

  const category = categories.find(c => c.id === id);
  const categorySchemes = schemes.filter(s => s.category === id);

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <span className="text-2xl mr-2">{category?.icon}</span>
          <span className="text-lg font-bold">
            {category ? (category[lang as keyof typeof category] as string) : ''}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {categorySchemes.map(s => (
          <SchemeCard key={s.id} scheme={s} lang={lang} />
        ))}
        {categorySchemes.length === 0 && (
          <p className="text-center text-muted-foreground py-8">{t(lang, 'noResults')}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
