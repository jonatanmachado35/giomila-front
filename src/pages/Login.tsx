import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LockKeyhole } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  loginWithEmailAndPassword,
  persistAuthenticatedUser,
} from "@/lib/auth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const remember = formData.get("remember") === "on";

    if (!email || !password) {
      setErrorMessage("Informe email e senha para continuar.");
      setLoading(false);
      return;
    }

    try {
      const authenticatedUser = await loginWithEmailAndPassword(email, password);

      if (!authenticatedUser) {
        setErrorMessage("Credenciais inválidas. Verifique email e senha.");
        return;
      }

      persistAuthenticatedUser(authenticatedUser, remember);
      navigate("/dashboard", { replace: true });
    } catch (authError) {
      setErrorMessage(
        authError instanceof Error
          ? authError.message
          : "Erro inesperado ao validar credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-gradient-primary rounded-lg shadow-card">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Giomila</h1>
            <p className="text-sm text-muted-foreground">Central de Monitoramento</p>
          </div>
        </div>

        <Card className="shadow-2xl border border-border/60 bg-card/95">
          <CardHeader className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-primary">
              <LockKeyhole className="h-5 w-5" />
              <p className="text-xs font-semibold tracking-widest uppercase">Acesso restrito</p>
            </div>
            <CardTitle className="text-2xl">Entrar no dashboard</CardTitle>
            <CardDescription>Use suas credenciais para acessar o sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground shadow-inner focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="font-medium text-foreground text-sm">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground shadow-inner focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <label className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="remember"
                  className="rounded border-border text-primary focus:ring-primary/40"
                />
                <span>Lembrar deste dispositivo</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:opacity-70 disabled:cursor-wait"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
