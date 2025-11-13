import { FormEvent, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ShieldCheck,
  LockKeyhole,
  ArrowRight,
  Eye,
  Radar,
  Sparkles,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  loginWithEmailAndPassword,
  persistAuthenticatedUser,
  getStoredUser,
} from "@/lib/auth";

const highlightMetrics = [
  {
    title: "Alertas do dia",
    value: "342",
    subtitle: "Monitorando 128 veículos",
    trend: "up" as const,
    trendValue: "+12%",
    variant: "warning" as const,
  },
  {
    title: "Motoristas conectados",
    value: 98,
    subtitle: "Em rota",
    trend: "neutral" as const,
    variant: "success" as const,
  },
  {
    title: "Eventos críticos",
    value: 26,
    subtitle: "Últimas 24h",
    trend: "down" as const,
    trendValue: "-8%",
    variant: "danger" as const,
  },
  {
    title: "Conformidade",
    value: "92%",
    subtitle: "Equipes treinadas",
    trend: "up" as const,
    trendValue: "+4%",
  },
];

const sellingPoints: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Monitoramento contínuo",
    description: "Painel em tempo real com insights acionáveis para a central de operações.",
    icon: Activity,
  },
  {
    title: "Protocolos inteligentes",
    description: "Fluxos de resposta integrados e alertas priorizados para cada evento crítico.",
    icon: Radar,
  },
  {
    title: "Confiança e segurança",
    description: "Criptografia corporativa e autenticação auditável para todos os acessos.",
    icon: ShieldCheck,
  },
];

const timelineEvents = [
  {
    time: "08:24",
    title: "Motorista L. Santos",
    detail: "Alerta de fadiga normalizado",
    status: "Resolvido",
  },
  {
    time: "09:03",
    title: "Equipe Norte",
    detail: "3 novos eventos de atenção",
    status: "Monitorando",
  },
  {
    time: "10:17",
    title: "Rota 52",
    detail: "Atualização de sensor confirmada",
    status: "Estável",
  },
];

const Logint = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const existingUser = getStoredUser();
    if (existingUser && typeof window !== "undefined") {
      window.location.replace("/");
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
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

      setSuccessMessage(
        `Bem-vindo${authenticatedUser.name ? `, ${authenticatedUser.name}` : ""}! Redirecionando...`
      );

      if (typeof window !== "undefined") {
        setTimeout(() => window.location.assign("/"), 900);
      }
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-card">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Giomila</p>
              <h1 className="text-xl font-semibold text-foreground">Central de Monitoramento Seguro</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
          <section className="flex-1 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlightMetrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>

            <Card className="shadow-card border border-border/60 bg-card/95">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Operação segura por padrão</CardTitle>
                    <CardDescription>
                      Os mesmos componentes do dashboard aplicados no onboarding da equipe.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    Tempo real
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sellingPoints.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start space-x-3 rounded-2xl border border-border/50 p-4"
                    >
                      <div className="p-2 rounded-xl bg-secondary/50 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card bg-gradient-to-br from-primary/5 via-secondary/10 to-background/60">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Atualizações em andamento</CardTitle>
                    <CardDescription>Fluxo contínuo dos principais alertas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {timelineEvents.map((eventItem) => (
                  <div
                    key={`${eventItem.time}-${eventItem.title}`}
                    className="flex items-center justify-between rounded-2xl bg-background/70 border border-border/40 px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {eventItem.time}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{eventItem.title}</p>
                      <p className="text-sm text-muted-foreground">{eventItem.detail}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {eventItem.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Dados sincronizados com Supabase e atualizados a cada 30s.
                </p>
              </CardFooter>
            </Card>
          </section>

          <section className="w-full lg:max-w-md">
            <Card className="shadow-2xl border border-border/60 bg-card/95 backdrop-blur">
              <CardHeader className="space-y-1">
                <div className="inline-flex items-center space-x-2 text-primary">
                  <LockKeyhole className="h-5 w-5" />
                  <p className="text-xs font-semibold tracking-widest uppercase">
                    Acesso restrito
                  </p>
                </div>
                <CardTitle className="text-2xl">Entrar no dashboard</CardTitle>
                <CardDescription>
                  Use suas credenciais corporativas para desbloquear a visão completa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {errorMessage && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {errorMessage}
                    </div>
                  )}

                  {successMessage && (
                    <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                      {successMessage}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email corporativo
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="nome.sobrenome@empresa.com"
                      className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground shadow-inner focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <label htmlFor="password" className="font-medium text-foreground">
                        Senha
                      </label>
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80 transition"
                      >
                        Esqueci a senha
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground shadow-inner focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <Eye className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
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
                    {loading ? "Validando credenciais..." : "Entrar"}
                  </button>

                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-border/80 bg-secondary/40 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
                  >
                    Entrar com SSO
                  </button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-xs text-muted-foreground text-center">
                  Ao continuar, você concorda com o monitoramento e auditoria dos acessos conforme política de segurança.
                </p>
                <div className="w-full rounded-2xl border border-border/50 bg-secondary/20 px-4 py-3 text-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Visualizar ambiente demo</p>
                    <p className="text-xs text-muted-foreground">Acesso somente leitura ao dashboard</p>
                  </div>
                  <a
                    href="/"
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80"
                  >
                    Acessar
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Logint;
