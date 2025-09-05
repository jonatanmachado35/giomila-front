import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyData {
  month: string;
  events: number;
  position: number;
  change: "up" | "down" | "same";
  changeValue: number;
}

interface MonthlyRankingProps {
  data: MonthlyData[];
  title: string;
}

export const MonthlyRanking = ({ data, title }: MonthlyRankingProps) => {
  const getPositionColor = (position: number) => {
    if (position <= 2) return "text-success";
    if (position <= 4) return "text-warning";
    return "text-destructive";
  };

  const getChangeIcon = (change: "up" | "down" | "same") => {
    switch (change) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-success" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const getPositionBadge = (position: number) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return `${position}º`;
  };

  return (
    <Card className="p-6 shadow-card h-full min-h-[360px] flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div className="space-y-3 flex-1 overflow-auto pr-1">
        {data.map((monthData, index) => (
          <div
            key={monthData.month}
            className="relative flex items-center justify-between p-3.5 rounded-lg bg-secondary/10 border border-border/30 hover:bg-secondary/20 transition-all duration-300 group"
          >
            {/* Linha de conexão entre meses */}
            {index < data.length - 1 && (
              <div className="absolute left-8 top-full w-px h-4 bg-border/50" />
            )}
            
            <div className="flex items-center space-x-4">
              {/* Posição */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full font-bold text-base border-2 transition-all duration-300 group-hover:scale-105",
                monthData.position <= 3 
                  ? "bg-gradient-primary border-primary/30 text-white" 
                  : "bg-secondary border-border text-foreground"
              )}>
                {getPositionBadge(monthData.position)}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-foreground">{monthData.month}</p>
                  {monthData.change !== "same" && (
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(monthData.change)}
                      <span className={cn(
                        "text-xs font-medium",
                        monthData.change === "up" ? "text-success" : "text-destructive"
                      )}>
                        {monthData.changeValue}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {monthData.events.toLocaleString()} eventos
                  </p>
                  <Badge 
                    variant={monthData.position <= 3 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {monthData.position}ª posição
                  </Badge>
                </div>
              </div>
            </div>

            {/* Barra de progresso visual */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    monthData.position <= 2 ? "bg-gradient-to-r from-success to-primary" :
                    monthData.position <= 4 ? "bg-gradient-to-r from-warning to-primary" :
                    "bg-gradient-to-r from-destructive to-warning"
                  )}
                  style={{ 
                    width: `${Math.max(20, 100 - (monthData.position - 1) * 15)}%` 
                  }}
                />
              </div>
              <span className={cn(
                "text-sm font-medium",
                getPositionColor(monthData.position)
              )}>
                #{monthData.position}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          Ranking baseado no número total de eventos por mês
        </p>
      </div>
    </Card>
  );
};
