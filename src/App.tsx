import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FactsPage from "./pages/FactsPage";
import TuneInPage from "./pages/TuneInPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import BrainTeasersPage from "./pages/BrainTeasersPage";
import JournalPage from "./pages/JournalPage";
import InsightsPage from "./pages/InsightsPage";
import LunaTrackerPage from "./pages/LunaTrackerPage";
import SleepCyclePage from "./pages/SleepCyclePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TherapistPage from "./pages/TherapistPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/therapist" element={<TherapistPage />} />
            <Route path="/facts" element={<FactsPage />} />
            <Route path="/tune-in" element={<TuneInPage />} />
            <Route path="/mindfulness" element={<MindfulnessPage />} />
            <Route path="/brain-teasers" element={<BrainTeasersPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/luna-tracker" element={<LunaTrackerPage />} />
            <Route path="/sleep-cycle" element={<SleepCyclePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
