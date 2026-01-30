import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DamageTimePage from "./pages/DamageTimePage";
import DamageRiskPage from "./pages/DamageRiskPage";
import SupportPage from "./pages/SupportPage";
import NotFound from "./pages/NotFound";
import GlobalRansomAlert from "@/components/GlobalRansomAlert";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GlobalRansomAlert />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/damage-time" element={<DamageTimePage />} />
          <Route path="/damage-risk" element={<DamageRiskPage />} />
          <Route path="/support" element={<SupportPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
