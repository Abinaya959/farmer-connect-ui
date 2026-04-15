import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { SessionProvider } from "@/contexts/SessionContext";
import Chatbot from "@/components/Chatbot";

import LanguageSelection from "./pages/LanguageSelection";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import StartFromScratch from "./pages/StartFromScratch";
import ExistingCrop from "./pages/ExistingCrop";
import ColdStorage from "./pages/ColdStorage";
import RiskPrediction from "./pages/RiskPrediction";
import Actions from "./pages/Actions";
import Explainability from "./pages/Explainability";
import Schemes from "./pages/Schemes";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLanguageSelected } = useLanguage();

  return (
    <>
      <Routes>
        <Route path="/" element={isLanguageSelected ? <Navigate to="/home" /> : <LanguageSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/start-fresh" element={<StartFromScratch />} />
        <Route path="/existing-crop" element={<ExistingCrop />} />
        <Route path="/cold-storage" element={<ColdStorage />} />
        <Route path="/risk-prediction" element={<RiskPrediction />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/explainability" element={<Explainability />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isLanguageSelected && <Chatbot />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <SessionProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SessionProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
