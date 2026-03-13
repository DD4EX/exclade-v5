import { useSchemes } from '@/lib/schemes-context';
import { useLanguage } from '@/lib/language-context';
import { Cloud, CloudOff, RefreshCw, Database } from 'lucide-react';

const SyncBanner = () => {
  const { lang } = useLanguage();
  const { schemes, lastSynced, syncStatus, refreshFromCloud } = useSchemes();

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return (
    <div className="mx-4 mt-3 p-3 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Cloud className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <CloudOff className="h-4 w-4 text-destructive" />
          )}
          <span className="text-xs font-medium text-foreground">
            {isOnline
              ? (lang === 'ta' ? 'ஆன்லைன்' : lang === 'tl' ? 'Online' : 'Online')
              : (lang === 'ta' ? 'ஆஃப்லைன்' : lang === 'tl' ? 'Offline' : 'Offline')}
          </span>
        </div>
        <button
          onClick={refreshFromCloud}
          disabled={syncStatus === 'syncing' || !isOnline}
          className="flex items-center gap-1 text-xs text-primary font-medium disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          {syncStatus === 'syncing'
            ? (lang === 'ta' ? 'புதுப்பிக்கிறது...' : lang === 'tl' ? 'Pudhuppikkurathu...' : 'Syncing...')
            : (lang === 'ta' ? 'புதுப்பி' : lang === 'tl' ? 'Pudhuppi' : 'Refresh')}
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          <span>{schemes.length} {lang === 'ta' ? 'திட்டங்கள்' : lang === 'tl' ? 'thittangal' : 'schemes'}</span>
        </div>
        <span>
          {lastSynced
            ? `${lang === 'ta' ? 'கடைசி:' : lang === 'tl' ? 'Kadaisi:' : 'Last:'} ${lastSynced}`
            : (lang === 'ta' ? 'உள்ளூர் தரவு' : lang === 'tl' ? 'Local data' : 'Local data')}
        </span>
      </div>
    </div>
  );
};

export default SyncBanner;
