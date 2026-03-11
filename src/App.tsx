import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import { SchemesProvider } from "@/lib/schemes-context";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SchemeDetailsPage from "./pages/SchemeDetailsPage";
import EligibilityPage from "./pages/EligibilityPage";
import HelpCentersPage from "./pages/HelpCentersPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import AboutPage from "./pages/AboutPage";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { hasChosenLanguage } = useLanguage();

  if (!hasChosenLanguage) {
    return <WelcomePage />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<><HomePage /><Footer /></>} />
          <Route path="/categories" element={<><HomePage /><Footer /></>} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/scheme/:id" element={<SchemeDetailsPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/help-centers" element={<HelpCentersPage />} />
          <Route path="/ai" element={<AIAssistantPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <LanguageProvider>
        <SchemesProvider>
          <AppContent />
        </SchemesProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
