import { MetricCard } from "@/components/dashboard/MetricCard";
import { EventChart } from "@/components/dashboard/EventChart";
import { DriverTable } from "@/components/dashboard/DriverTable";
import { BehaviorChart } from "@/components/dashboard/BehaviorChart";
import { FatigueChart } from "@/components/dashboard/FatigueChart";
import { MonthlyRanking } from "@/components/dashboard/MonthlyRanking";
import { mockData } from "@/data/mockData";
import { Activity, Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-card">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">Dashboard de Monitoramento</h1>
              <p className="hidden md:block text-xs text-muted-foreground">Eventos, fadiga e comportamento da frota</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Eventos"
            value={mockData.metrics.totalEvents.toLocaleString()}
            subtitle="Este mês"
            trend="up"
            trendValue={`+${mockData.metrics.monthlyIncrease}%`}
            variant="default"
          />
          
          <MetricCard
            title="Motoristas Ativos"
            value={mockData.metrics.activeDrivers}
            subtitle="Na frota"
            trend="neutral"
            variant="success"
          />
          
          <MetricCard
            title="Horário de Pico"
            value={mockData.metrics.peakHour}
            subtitle="Mais eventos"
            variant="warning"
          />
          
          <MetricCard
            title="Alertas de Fadiga"
            value={mockData.metrics.fatigueAlerts}
            subtitle="Últimas 24h"
            trend="down"
            trendValue="-5%"
            variant="danger"
          />
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventChart
            data={mockData.hourlyEvents}
            title="Eventos por Horário"
          />
          
          <BehaviorChart
            data={mockData.events}
            title="Tipos de Eventos Mais Frequentes"
          />
        </div>

        {/* Seção de Análise Detalhada */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <DriverTable
              drivers={mockData.topDrivers}
              title="Top Motoristas com Mais Eventos"
            />
          </div>
          
          <div className="space-y-6">
            {/* Card de Comportamentos */}
            <div className="bg-card border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Comportamentos Críticos</h3>
              </div>
              <div className="space-y-3">
                {mockData.behaviors.map((behavior, index) => (
                  <div key={behavior.type} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">{behavior.type}</p>
                      <p className="text-xs text-muted-foreground">Risco: {behavior.risk}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{behavior.count}</p>
                      <p className="text-xs text-muted-foreground">ocorrências</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Ranking + Fadiga em largura total */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyRanking
            data={mockData.monthlyRanking.slice(0, 4)}
            title="Ranking dos Últimos Meses"
          />
          <FatigueChart
            data={mockData.fatigueByHour}
            title="Alertas de Fadiga por Horário"
          />
        </div>

      </div>
    </div>
  );
};

export default Index;
