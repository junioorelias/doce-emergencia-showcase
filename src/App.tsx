
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { useState, useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";

// Lazy load non-critical pages
const FazerPedido = lazy(() => import("./pages/FazerPedido"));
const Franquia = lazy(() => import("./pages/Franquia"));
const DescontosExclusivos = lazy(() => import("./pages/DescontosExclusivos"));
const NossaHistoria = lazy(() => import("./pages/NossaHistoria"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosUso = lazy(() => import("./pages/TermosUso"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

  // Always render content, but show splash overlay on top
  const mainContent = (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fazer-pedido" element={<Suspense fallback={null}><FazerPedido /></Suspense>} />
              <Route path="/franquia" element={<Suspense fallback={null}><Franquia /></Suspense>} />
              <Route path="/descontos-exclusivos" element={<Suspense fallback={null}><DescontosExclusivos /></Suspense>} />
              <Route path="/nossa-historia" element={<Suspense fallback={null}><NossaHistoria /></Suspense>} />
              <Route path="/politica-privacidade" element={<Suspense fallback={null}><PoliticaPrivacidade /></Suspense>} />
              <Route path="/termos-uso" element={<Suspense fallback={null}><TermosUso /></Suspense>} />
              <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );

  if (showSplash) {
    return (
      <>
        <div style={{ visibility: 'hidden', position: 'absolute', pointerEvents: 'none' }}>
          {mainContent}
        </div>
        <SplashScreen onComplete={handleSplashComplete} />
      </>
    );
  }

  if (!isAppReady) {
    return null;
  }

  return mainContent;
};

export default App;
