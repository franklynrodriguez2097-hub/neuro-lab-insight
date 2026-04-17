import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import Studies from "./pages/Studies";
import CreateStudy from "./pages/CreateStudy";
import StudyDetail from "./pages/StudyDetail";
import Stimuli from "./pages/Stimuli";
import Surveys from "./pages/Surveys";
import Sessions from "./pages/Sessions";
import Analytics from "./pages/Analytics";
import Export from "./pages/Export";
import Settings from "./pages/Settings";
import ParticipantFlow from "./pages/ParticipantFlow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/studies" element={<Studies />} />
            <Route path="/studies/new" element={<CreateStudy />} />
            <Route path="/studies/:id/edit" element={<CreateStudy />} />
            <Route path="/studies/:id" element={<StudyDetail />} />
            <Route path="/stimuli" element={<Stimuli />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/export" element={<Export />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/participate" element={<ParticipantFlow />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
