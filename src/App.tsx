import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Studies from "./pages/Studies";
import Stimuli from "./pages/Stimuli";
import Surveys from "./pages/Surveys";
import Participants from "./pages/Participants";
import Analytics from "./pages/Analytics";
import Export from "./pages/Export";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/stimuli" element={<Stimuli />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/export" element={<Export />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
