import React, { createContext, useContext, useState, useEffect } from 'react';

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
};

const SchemesContext = createContext<SchemesContextType>({
  schemes: [],
  categories: [],
  helpCenters: [],
  loading: true,
});

export const SchemesProvider = ({ children }: { children: React.ReactNode }) => {
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [helpCenters, setHelpCenters] = useState<HelpCenterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/schemes.json').then(r => r.json()),
      fetch('/data/categories.json').then(r => r.json()),
      fetch('/data/helpcenters.json').then(r => r.json()),
    ]).then(([s, c, h]) => {
      setSchemes(s);
      setCategories(c);
      setHelpCenters(h);
      setLoading(false);
    }).catch(() => {
      // Try localStorage fallback
      const cached = localStorage.getItem('chithur-schemes');
      if (cached) {
        const data = JSON.parse(cached);
        setSchemes(data.schemes || []);
        setCategories(data.categories || []);
        setHelpCenters(data.helpCenters || []);
      }
      setLoading(false);
    });
  }, []);

  // Cache data for offline use
  useEffect(() => {
    if (schemes.length > 0) {
      localStorage.setItem('chithur-schemes', JSON.stringify({ schemes, categories, helpCenters }));
    }
  }, [schemes, categories, helpCenters]);

  return (
    <SchemesContext.Provider value={{ schemes, categories, helpCenters, loading }}>
      {children}
    </SchemesContext.Provider>
  );
};

export const useSchemes = () => useContext(SchemesContext);
