import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

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
                to="/descontos-exclusivos"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/descontos-exclusivos")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                DESCONTOS
              </Link>
              <Link
                to="/nossa-historia"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/nossa-historia")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                HISTÓRIA
              </Link>
              <Link
                to="/franquia"
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive("/franquia")
                    ? "text-doce-white border-b-2 border-doce-yellow"
                    : "text-doce-white/80 hover:text-doce-white"
                }`}
              >
                FRANQUIA
              </Link>
            </nav>
          </div>

          {/* Member Button - Desktop */}
          <Link 
            to="/descontos-exclusivos"
            className="hidden md:block"
          >
            <button className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 transition-colors px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap">
              Torne-se Membro
            </button>
          </Link>

          {/* Mobile Menu - White background, red text */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-doce-white p-2">
                <Menu className="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white border-gray-200"
              >
                <DropdownMenuItem asChild>
                  <Link to="/" className="w-full cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                    HOME
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/fazer-pedido" className="w-full cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                    CARDÁPIO
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/descontos-exclusivos" className="w-full cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                    DESCONTOS
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/nossa-historia" className="w-full cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                    HISTÓRIA
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/franquia" className="w-full cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                    FRANQUIA
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/descontos-exclusivos" className="w-full cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                    TORNE-SE MEMBRO
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
