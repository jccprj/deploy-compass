import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import JiraListPage from "./pages/JiraListPage";
import JiraDetailPage from "./pages/JiraDetailPage";
import ServiceListPage from "./pages/ServiceListPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PromoteToProdPage from "./pages/PromoteToProdPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/jira" replace />} />
          <Route element={<AppShell />}>
            <Route path="/jira" element={<JiraListPage />} />
            <Route path="/jira/:key" element={<JiraDetailPage />} />
            <Route path="/services" element={<ServiceListPage />} />
            <Route path="/services/:serviceName" element={<ServiceDetailPage />} />
            <Route path="/promote" element={<PromoteToProdPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
