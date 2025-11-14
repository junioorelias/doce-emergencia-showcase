import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/meu-perfil");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta! 🍰",
      });
      
      navigate("/meu-perfil");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Verifique as senhas digitadas",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: signupData.name,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Bem-vindo à Doce Emergência! 🎉",
      });
      
      navigate("/meu-perfil");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/meu-perfil`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro no login com Google",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-doce-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-doce-brown" />
            </div>
            <h1 className="text-3xl font-bold text-doce-brown mb-2">
              Minha Conta
            </h1>
            <p className="text-doce-brown/80">
              Entre ou crie sua conta para aproveitar todos os benefícios
            </p>
          </div>

          <Card className="p-8 bg-doce-white shadow-xl">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-doce-brown mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-doce-brown mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
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
                    className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold py-3 mt-6"
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-doce-brown/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-doce-white px-2 text-doce-brown/60">ou</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    variant="outline"
                    className="w-full border-doce-yellow text-doce-brown hover:bg-doce-yellow/10"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Entrar com Google
                  </Button>
                </form>
              </TabsContent>

              {/* Signup */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-doce-brown mb-2">
                      Nome completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome"
                        className="pl-10"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-doce-brown mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-doce-brown mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
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

                  <div>
                    <label htmlFor="signup-confirm" className="block text-sm font-medium text-doce-brown mb-2">
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doce-brown/50" />
                      <Input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold py-3 mt-6"
                  >
                    {loading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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

export default Auth;