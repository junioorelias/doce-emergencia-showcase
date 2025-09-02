
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [session, setSession] = useState<Session | null>(null);

  const isActive = (path: string) => currentPath === path;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-background shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/lovable-uploads/a4a13826-9001-4d9f-aae3-2ad87589ea6d.png" 
              alt="Doce Emergência" 
              className="h-20 w-auto"
            />
          </Link>

          {/* Navigation - Desktop - Absolutely centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                HOME
              </Link>
              <Link
                to="/fazer-pedido"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/fazer-pedido")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                CARDÁPIO
              </Link>
              <Link
                to="/cupons"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/cupons")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                CUPONS
              </Link>
              <Link
                to="/votacao"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/votacao")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                VOTAÇÃO
              </Link>
            </nav>
          </div>

          {/* Profile Section - Desktop */}
          <div className="hidden md:flex flex-shrink-0">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link to="/meu-perfil" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-doce-yellow text-doce-brown">
                      {session.user.user_metadata?.display_name?.[0] || session.user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-doce-white font-medium text-sm hidden lg:inline">
                    {session.user.user_metadata?.display_name || session.user.email?.split('@')[0]}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-doce-white hover:bg-doce-white/10 transition-colors active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold px-4 lg:px-6 shadow-lg transition-all active:scale-95"
                asChild
              >
                <Link to="/auth">
                  LOGIN
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-3 flex-shrink-0">
            {/* User Icon */}
            <Button
              variant="ghost"
              className="text-doce-white hover:bg-doce-white/10 transition-colors h-16 w-16 p-0"
              asChild
            >
              <Link to={session ? "/meu-perfil" : "/auth"}>
                <User className="h-12 w-12" />
              </Link>
            </Button>
            
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-doce-white hover:bg-doce-white/10 transition-colors h-16 w-16 p-0"
                >
                  <Menu className="h-12 w-12" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-background border-doce-white/20 z-50"
              >
                <DropdownMenuItem asChild>
                  <Link 
                    to="/" 
                    className={`w-full cursor-pointer ${
                      isActive("/") 
                        ? "text-doce-yellow font-bold" 
                        : "text-doce-white hover:text-doce-yellow"
                    }`}
                  >
                    HOME
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/fazer-pedido" 
                    className={`w-full cursor-pointer ${
                      isActive("/fazer-pedido") 
                        ? "text-doce-yellow font-bold" 
                        : "text-doce-white hover:text-doce-yellow"
                    }`}
                  >
                    CARDÁPIO
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/cupons" 
                    className={`w-full cursor-pointer ${
                      isActive("/cupons") 
                        ? "text-doce-yellow font-bold" 
                        : "text-doce-white hover:text-doce-yellow"
                    }`}
                  >
                    CUPONS
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/votacao" 
                    className={`w-full cursor-pointer ${
                      isActive("/votacao") 
                        ? "text-doce-yellow font-bold" 
                        : "text-doce-white hover:text-doce-yellow"
                    }`}
                  >
                    VOTAÇÃO
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
