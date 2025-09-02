import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Credenciais hard-coded (em produção, isso deveria vir de variáveis de ambiente ou backend)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "doce2024"
  };

  useEffect(() => {
    // Verificar se já está logado como admin
    const adminToken = localStorage.getItem('admin_session');
    if (adminToken === 'authenticated') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha usuário e senha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem('admin_session', 'authenticated');
        toast({
          title: "Acesso autorizado",
          description: "Bem-vindo ao painel administrativo! 🔐",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Acesso negado",
          description: "Credenciais inválidas",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-doce-brown mb-2">
              Painel Administrativo
            </h1>
            <p className="text-doce-brown/80">
              Acesso restrito para administradores
            </p>
          </div>

          <Card className="p-8 bg-doce-white shadow-xl border-2 border-red-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-doce-brown mb-2">
                  Usuário
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nome de usuário"
                    className="pl-10"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-doce-brown mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4 text-doce-brown/50" /> : 
                      <Eye className="h-4 w-4 text-doce-brown/50" />
                    }
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white hover:bg-red-700 font-bold py-3 mt-6"
              >
                {loading ? "Verificando..." : "Acessar Painel"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Área restrita. Acesso apenas para administradores autorizados.
              </p>
            </div>
          </Card>

          {/* Links adicionais */}
          <div className="text-center mt-6">
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="text-doce-brown/70 hover:text-doce-brown"
            >
              ← Voltar para a página inicial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;