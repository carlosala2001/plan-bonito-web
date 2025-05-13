
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import MetalScale from "./pages/MetalScale";
import ZenoVPS from "./pages/ZenoVPS";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import HetrixToolsSettings from "./pages/admin/HetrixToolsSettings";
import CtrlPanelSettings from "./pages/admin/CtrlPanelSettings";
import ZohoMailSettings from "./pages/admin/ZohoMailSettings";
import NewsletterManager from "./pages/admin/NewsletterManager";
import PlansManager from "./pages/admin/PlansManager";
import PagesManager from "./pages/admin/PagesManager";
import PageEditor from "./pages/admin/PageEditor";
import GamesManager from "./pages/admin/GamesManager";
import NewsletterUnsubscribe from "./pages/NewsletterUnsubscribe";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AdminGuard } from "./components/guards/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/metalscale" element={<MetalScale />} />
              <Route path="/zenovps" element={<ZenoVPS />} />
              <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin routes - protected */}
              <Route path="/admin" element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="hetrixtools" element={<HetrixToolsSettings />} />
                <Route path="ctrlpanel" element={<CtrlPanelSettings />} />
                <Route path="zohomail" element={<ZohoMailSettings />} />
                <Route path="newsletter" element={<NewsletterManager />} />
                <Route path="plans" element={<PlansManager />} />
                <Route path="plans/:type" element={<PlansManager />} />
                <Route path="pages" element={<PagesManager />} />
                <Route path="pages/:id" element={<PageEditor />} />
                <Route path="games" element={<GamesManager />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
