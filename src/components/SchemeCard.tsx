import { useNavigate } from 'react-router-dom';
import { SchemeData } from '@/lib/schemes-context';
import { Language, t } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';

type Props = { scheme: SchemeData; lang: Language };

const SchemeCard = ({ scheme, lang }: Props) => {
  const navigate = useNavigate();
  const data = scheme[lang as keyof typeof scheme] as any;

  return (
    <button
      onClick={() => navigate(`/scheme/${scheme.id}`)}
      className="w-full text-left bg-card p-4 rounded-lg border border-border hover:border-primary active:scale-[0.98] transition-all"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-foreground text-base pr-2">{data.name}</h3>
        <Badge variant={scheme.status === 'Open' ? 'default' : 'destructive'} className="text-xs shrink-0">
          {scheme.status === 'Open' ? t(lang, 'open') : t(lang, 'closed')}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{data.description}</p>
      <p className="text-xs text-muted-foreground">
        {t(lang, 'lastUpdated')}: {scheme.last_updated}
      </p>
    </button>
  );
};

export default SchemeCard;
