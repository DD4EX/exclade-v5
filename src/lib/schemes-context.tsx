import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SchemeData = {
  id: string;
  category: string;
  status: string;
  last_updated: string;
  official_source: string;
  popular: boolean;
  en: { name: string; description: string; eligibility: string[]; benefits: string; documents: string[]; steps: string[] };
  ta: { name: string; description: string; eligibility: string[]; benefits: string; documents: string[]; steps: string[] };
  tl: { name: string; description: string; eligibility: string[]; benefits: string; documents: string[]; steps: string[] };
};

export type CategoryData = {
  id: string;
  icon: string;
  en: string;
  ta: string;
  tl: string;
};

export type HelpCenterData = {
  id: string;
  en: { name: string; address: string };
  ta: { name: string; address: string };
  tl: { name: string; address: string };
  map_link: string;
};

type SchemesContextType = {
  schemes: SchemeData[];
  categories: CategoryData[];
  helpCenters: HelpCenterData[];
  loading: boolean;
  lastSynced: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  refreshFromCloud: () => Promise<void>;
};

const SchemesContext = createContext<SchemesContextType>({
  schemes: [],
  categories: [],
  helpCenters: [],
  loading: true,
  lastSynced: null,
  syncStatus: 'idle',
  refreshFromCloud: async () => {},
});

const CACHE_KEY = 'chithur-schemes';
const SYNC_TIME_KEY = 'chithur-last-sync';

// Convert live_schemes DB row to SchemeData format
function dbRowToScheme(row: any): SchemeData {
  return {
    id: row.scheme_id,
    category: row.category,
    status: row.status,
    last_updated: row.last_updated || '',
    official_source: row.official_source || '',
    popular: row.popular || false,
    en: row.data_en as any,
    ta: row.data_ta as any,
    tl: row.data_tl as any,
  };
}

export const SchemesProvider = ({ children }: { children: React.ReactNode }) => {
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [helpCenters, setHelpCenters] = useState<HelpCenterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Load local JSON data (always available offline)
  const loadLocalData = useCallback(async () => {
    try {
      const [s, c, h] = await Promise.all([
        fetch('/data/schemes.json').then(r => r.json()),
        fetch('/data/categories.json').then(r => r.json()),
        fetch('/data/helpcenters.json').then(r => r.json()),
      ]);
      return { schemes: s as SchemeData[], categories: c as CategoryData[], helpCenters: h as HelpCenterData[] };
    } catch {
      // Try localStorage cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        return { schemes: data.schemes || [], categories: data.categories || [], helpCenters: data.helpCenters || [] };
      }
      return { schemes: [], categories: [], helpCenters: [] };
    }
  }, []);

  // Fetch live schemes from Lovable Cloud DB
  const fetchCloudSchemes = useCallback(async (): Promise<SchemeData[]> => {
    try {
      const { data, error } = await supabase
        .from('live_schemes')
        .select('*')
        .order('popular', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map(dbRowToScheme);
    } catch (err) {
      console.log('Cloud fetch failed (offline or limit reached), using local data:', err);
      return [];
    }
  }, []);

  // Merge local + cloud schemes (cloud overwrites matching IDs, adds new ones)
  const mergeSchemes = (local: SchemeData[], cloud: SchemeData[]): SchemeData[] => {
    const merged = new Map<string, SchemeData>();
    
    // Add local first
    for (const s of local) merged.set(s.id, s);
    
    // Cloud data overwrites/adds
    for (const s of cloud) merged.set(s.id, s);
    
    return Array.from(merged.values());
  };

  // Refresh from cloud (called on app open + manual refresh button)
  const refreshFromCloud = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      // First trigger the edge function to update DB with latest data
      await supabase.functions.invoke('sync-schemes', { body: { source: 'manual' } });
      
      // Then fetch the updated data
      const cloudSchemes = await fetchCloudSchemes();
      
      if (cloudSchemes.length > 0) {
        setSchemes(prev => {
          const merged = mergeSchemes(prev, cloudSchemes);
          // Cache merged data
          localStorage.setItem(CACHE_KEY, JSON.stringify({ 
            schemes: merged, 
            categories, 
            helpCenters 
          }));
          return merged;
        });
        
        const now = new Date().toLocaleString('en-IN');
        setLastSynced(now);
        localStorage.setItem(SYNC_TIME_KEY, now);
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch {
      console.log('Cloud sync failed, continuing with local data');
      setSyncStatus('error');
    }
  }, [fetchCloudSchemes, categories, helpCenters]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      // 1. Load local JSON data first (instant, works offline)
      const local = await loadLocalData();
      setCategories(local.categories);
      setHelpCenters(local.helpCenters);
      
      // 2. Check localStorage for cached cloud data
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cachedData = JSON.parse(cached);
        setSchemes(cachedData.schemes || local.schemes);
      } else {
        setSchemes(local.schemes);
      }
      
      setLastSynced(localStorage.getItem(SYNC_TIME_KEY));
      setLoading(false);

      // 3. Try to fetch cloud data in background (if online)
      if (navigator.onLine) {
        try {
          const cloudSchemes = await fetchCloudSchemes();
          if (cloudSchemes.length > 0) {
            setSchemes(prev => mergeSchemes(prev, cloudSchemes));
            const now = new Date().toLocaleString('en-IN');
            setLastSynced(now);
            localStorage.setItem(SYNC_TIME_KEY, now);
          }
        } catch {
          // Silently fail — local data is already loaded
        }
      }
    };
    
    init();
  }, [loadLocalData, fetchCloudSchemes]);

  // Cache data whenever it changes
  useEffect(() => {
    if (schemes.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ schemes, categories, helpCenters }));
    }
  }, [schemes, categories, helpCenters]);

  return (
    <SchemesContext.Provider value={{ schemes, categories, helpCenters, loading, lastSynced, syncStatus, refreshFromCloud }}>
      {children}
    </SchemesContext.Provider>
  );
};

export const useSchemes = () => useContext(SchemesContext);
