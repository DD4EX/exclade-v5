import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/i18n';
import { Home, Grid3X3, CheckSquare, MapPin, MessageCircle, Info } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, labelKey: 'home' as const },
  { path: '/categories', icon: Grid3X3, labelKey: 'categories' as const },
  { path: '/eligibility', icon: CheckSquare, labelKey: 'eligibilityChecker' as const },
  { path: '/help-centers', icon: MapPin, labelKey: 'helpCenters' as const },
  { path: '/about', icon: Info, labelKey: 'about' as const },
];

const BottomNav = () => {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{t(lang, item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
