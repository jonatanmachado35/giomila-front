import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BehaviorData {
  name: string;
  count: number;
  percentage: number;
}

interface BehaviorChartProps {
  data: BehaviorData[];
  title: string;
}

const COLORS = [
  "hsl(217.2 91.2% 59.8%)", // primary
  "hsl(262.1 83.3% 57.8%)", // purple
  "hsl(142.1 76.2% 36.3%)", // success
  "hsl(38.2 92% 50%)",      // warning
  "hsl(0 72.2% 50.6%)",     // destructive
  "hsl(221.2 83.2% 53.3%)", // info
];

export const BehaviorChart = ({ data, title }: BehaviorChartProps) => {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number, name: string) => [
                `${value} eventos`,
                name
              ]}
            />
            <Legend 
              wrapperStyle={{
                color: "hsl(var(--foreground))",
                fontSize: "14px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
