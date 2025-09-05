import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Driver {
  name: string;
  events: number;
  mainEvent: string;
  badge: string;
}

interface DriverTableProps {
  drivers: Driver[];
  title: string;
}

export const DriverTable = ({ drivers, title }: DriverTableProps) => {
  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "crítico":
        return "destructive";
      case "alto risco":
        return "destructive";
      case "atenção":
        return "secondary";
      case "moderado":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {drivers.map((driver, index) => (
          <div
            key={driver.name}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 border border-border/30 hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-foreground">{driver.name}</p>
                <p className="text-sm text-muted-foreground">{driver.mainEvent}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-foreground">{driver.events}</p>
                <p className="text-xs text-muted-foreground">eventos</p>
              </div>
              <Badge variant={getBadgeVariant(driver.badge)}>
                {driver.badge}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
