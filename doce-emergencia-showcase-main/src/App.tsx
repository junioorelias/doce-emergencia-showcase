
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import FazerPedido from "./pages/FazerPedido";
import MeuPerfil from "./pages/MeuPerfil";
import Cupons from "./pages/Cupons";
import Recompensas from "./pages/Recompensas";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Votacao from "./pages/Votacao";
import Franquia from "./pages/Franquia";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (!splashShown) {
      setShowSplash(true);
    } else {
      setIsAppReady(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
    setIsAppReady(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isAppReady) {
    return null; // Prevent flash before splash or content loads
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fazer-pedido" element={<FazerPedido />} />
            <Route path="/meu-perfil" element={<MeuPerfil />} />
            <Route path="/cupons" element={<Cupons />} />
            <Route path="/recompensas" element={<Recompensas />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/votacao" element={<Votacao />} />
            <Route path="/franquia" element={<Franquia />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
