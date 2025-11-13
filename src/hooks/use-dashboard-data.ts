import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSupabaseClient } from "@/lib/supabase";

const TABLE_NAME = "dados_veiculo";
const MAX_ROWS = 2000;

interface EventTypeRow {
  name: string;
  count: number;
  percentage: number;
}

interface HourlyEventRow {
  hour: string;
  events: number;
}

interface DriverRow {
  name: string;
  events: number;
  mainEvent: string;
  badge: string;
}

interface FatigueRow {
  hour: string;
  fatigue: number;
}

interface BehaviorRow {
  type: string;
  count: number;
  risk: string;
}

interface MonthlyRankingRow {
  month: string;
  events: number;
  position: number;
  change: "up" | "down" | "same";
  changeValue: number;
}

interface DadosVeiculoRow {
  data_hora_local: string | null;
  data_hora_utc: string | null;
  motorista_nome: string | null;
  motorista_cpf: string | null;
  tipo_operacao: string | null;
  operacao_atual: string | null;
  ultimo_evento_tipo: string | null;
  dms_pessoa_detectada: boolean | number | null;
  dms_olhos_fechados: boolean | number | null;
  dms_bocejo_detectado: boolean | number | null;
  dms_celular_detectado: boolean | number | null;
  dms_postura_correta: boolean | number | null;
  falso_positivo: boolean | number | null;
  excesso_velocidade: boolean | number | null;
  panico: boolean | number | null;
}

interface MonthAggregate {
  key: string;
  label: string;
  events: number;
  date: Date;
}

export interface DashboardData {
  events: EventTypeRow[];
  hourlyEvents: HourlyEventRow[];
  topDrivers: DriverRow[];
  fatigueByHour: FatigueRow[];
  behaviors: BehaviorRow[];
  monthlyRanking: MonthlyRankingRow[];
  metrics: {
    totalEvents: number;
    activeDrivers: number;
    peakHour: string;
    riskScore: number;
    monthlyIncrease: number;
    fatigueAlerts: number;
  };
}

const emptyDashboardData: DashboardData = {
  events: [],
  hourlyEvents: [],
  topDrivers: [],
  fatigueByHour: [],
  behaviors: [],
  monthlyRanking: [],
  metrics: {
    totalEvents: 0,
    activeDrivers: 0,
    peakHour: "--:--",
    riskScore: 0,
    monthlyIncrease: 0,
    fatigueAlerts: 0,
  },
};

const columnSelection = [
  "data_hora_local",
  "data_hora_utc",
  "motorista_nome",
  "motorista_cpf",
  "tipo_operacao",
  "operacao_atual",
  "ultimo_evento_tipo",
  "dms_pessoa_detectada",
  "dms_olhos_fechados",
  "dms_bocejo_detectado",
  "dms_celular_detectado",
  "dms_postura_correta",
  "falso_positivo",
  "excesso_velocidade",
  "panico",
].join(",");

const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    return ["true", "t", "1", "sim", "yes", "y"].includes(value.toLowerCase());
  }
  return false;
};

const parseTimestamp = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    const date = new Date(
      numericValue > 1_000_000_000_000 ? numericValue : numericValue * 1000,
    );
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};

const formatHourLabel = (hour: number) =>
  `${String(hour).padStart(2, "0")}:00`;

const formatMonthLabel = (date: Date) => {
  const label = format(date, "MMMM", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const getEventName = (row: DadosVeiculoRow) => {
  const candidates = [
    row.ultimo_evento_tipo,
    row.tipo_operacao,
    row.operacao_atual,
  ];

  const value = candidates.find(
    (candidate) => candidate && candidate.trim().length > 0,
  );

  return value ?? "Evento não identificado";
};

const isFatigueEvent = (row: DadosVeiculoRow) =>
  asBoolean(row.dms_olhos_fechados) || asBoolean(row.dms_bocejo_detectado);

const getDriverBadge = (events: number) => {
  if (events >= 30) return "Crítico";
  if (events >= 20) return "Alto Risco";
  if (events >= 10) return "Atenção";
  return "Moderado";
};

const buildBehaviors = (rows: DadosVeiculoRow[]): BehaviorRow[] => {
  const counters = {
    usoCelular: 0,
    olhosFechados: 0,
    bocejo: 0,
    posturaIncorreta: 0,
    panico: 0,
    falsoPositivo: 0,
    pessoaDetectada: 0,
  };

  rows.forEach((row) => {
    if (asBoolean(row.dms_celular_detectado)) counters.usoCelular += 1;
    if (asBoolean(row.dms_olhos_fechados)) counters.olhosFechados += 1;
    if (asBoolean(row.dms_bocejo_detectado)) counters.bocejo += 1;
    if (asBoolean(row.panico)) counters.panico += 1;
    if (asBoolean(row.falso_positivo)) counters.falsoPositivo += 1;
    if (asBoolean(row.dms_pessoa_detectada)) counters.pessoaDetectada += 1;

    if (
      row.dms_postura_correta !== null &&
      row.dms_postura_correta !== undefined &&
      !asBoolean(row.dms_postura_correta)
    ) {
      counters.posturaIncorreta += 1;
    }
  });

  const summary = [
    {
      type: "Uso de celular",
      count: counters.usoCelular,
      risk: counters.usoCelular > 5 ? "Crítico" : "Alto",
    },
    {
      type: "Olhos fechados",
      count: counters.olhosFechados,
      risk: counters.olhosFechados > 3 ? "Crítico" : "Alto",
    },
    {
      type: "Bocejo detectado",
      count: counters.bocejo,
      risk: counters.bocejo > 3 ? "Atenção" : "Moderado",
    },
    {
      type: "Pessoa detectada",
      count: counters.pessoaDetectada,
      risk: "Moderado",
    },
    {
      type: "Postura incorreta",
      count: counters.posturaIncorreta,
      risk: counters.posturaIncorreta > 0 ? "Atenção" : "Baixo",
    },
    {
      type: "Pânico acionado",
      count: counters.panico,
      risk: counters.panico > 0 ? "Crítico" : "Baixo",
    },
    {
      type: "Falsos positivos",
      count: counters.falsoPositivo,
      risk: "Baixo",
    },
  ]
    .filter((behavior) => behavior.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return summary.length
    ? summary
    : [{ type: "Sem registros recentes", count: 0, risk: "Baixo" }];
};

const buildMonthlyRanking = (
  months: MonthAggregate[],
): MonthlyRankingRow[] => {
  if (!months.length) return [];

  const rankingOrder = [...months].sort((a, b) => b.events - a.events);
  const positions = new Map<string, number>();

  rankingOrder.forEach((month, index) => {
    positions.set(month.key, index + 1);
  });

  return months.slice(0, 6).map((month, index) => {
    const previous = months[index + 1];
    const diff = previous ? month.events - previous.events : 0;
    let change: "up" | "down" | "same" = "same";

    if (diff > 0) change = "up";
    if (diff < 0) change = "down";

    return {
      month: month.label,
      events: month.events,
      position: positions.get(month.key) ?? index + 1,
      change,
      changeValue: Math.abs(diff),
    };
  });
};

const computeMonthlyIncrease = (months: MonthAggregate[]) => {
  if (months.length < 2) return 0;
  const [current, previous] = months;

  if (!previous || previous.events === 0) {
    return current.events > 0 ? 100 : 0;
  }

  const variation =
    ((current.events - previous.events) / previous.events) * 100;

  return Number(variation.toFixed(1));
};

const buildDashboardData = (rows: DadosVeiculoRow[]): DashboardData => {
  if (!rows.length) return emptyDashboardData;

  const totalEvents = rows.length;
  const eventCounts = new Map<string, number>();
  const hourlyCounts = new Map<number, number>();
  const fatigueCounts = new Map<number, number>();
  const driverMap = new Map<string, { events: number; eventCounts: Record<string, number> }>();
  const monthMap = new Map<string, MonthAggregate>();

  let fatigueAlerts = 0;
  let speedIncidents = 0;
  let panicIncidents = 0;

  rows.forEach((row) => {
    const eventName = getEventName(row);
    eventCounts.set(eventName, (eventCounts.get(eventName) ?? 0) + 1);

    const timestamp = parseTimestamp(row.data_hora_local ?? row.data_hora_utc);
    if (timestamp) {
      const hour = timestamp.getHours();
      hourlyCounts.set(hour, (hourlyCounts.get(hour) ?? 0) + 1);

      const monthKey = `${timestamp.getFullYear()}-${String(
        timestamp.getMonth() + 1,
      ).padStart(2, "0")}`;

      const monthEntry = monthMap.get(monthKey);
      if (monthEntry) {
        monthEntry.events += 1;
        if (timestamp > monthEntry.date) {
          monthEntry.date = timestamp;
        }
      } else {
        monthMap.set(monthKey, {
          key: monthKey,
          label: formatMonthLabel(timestamp),
          events: 1,
          date: timestamp,
        });
      }

      if (isFatigueEvent(row)) {
        fatigueCounts.set(hour, (fatigueCounts.get(hour) ?? 0) + 1);
        fatigueAlerts += 1;
      }
    }

    const driverName =
      row.motorista_nome?.trim() || "Motorista não identificado";
    const driver = driverMap.get(driverName) ?? {
      events: 0,
      eventCounts: {} as Record<string, number>,
    };

    driver.events += 1;
    driver.eventCounts[eventName] =
      (driver.eventCounts[eventName] ?? 0) + 1;
    driverMap.set(driverName, driver);

    if (asBoolean(row.excesso_velocidade)) speedIncidents += 1;
    if (asBoolean(row.panico)) panicIncidents += 1;
  });

  const events = Array.from(eventCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Number(((count / totalEvents) * 100).toFixed(1)),
    }));

  const hourlyEvents = Array.from(hourlyCounts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([hour, count]) => ({
      hour: formatHourLabel(hour),
      events: count,
    }));

  const fatigueByHour = Array.from(fatigueCounts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([hour, count]) => ({
      hour: formatHourLabel(hour),
      fatigue: count,
    }));

  const topDrivers = Array.from(driverMap.entries())
    .sort((a, b) => b[1].events - a[1].events)
    .slice(0, 5)
    .map(([name, driver]) => ({
      name,
      events: driver.events,
      mainEvent:
        Object.entries(driver.eventCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        "Evento não identificado",
      badge: getDriverBadge(driver.events),
    }));

  const chronologicalMonths = Array.from(monthMap.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const monthlyRanking = buildMonthlyRanking(chronologicalMonths);
  const behaviors = buildBehaviors(rows);

  const peakHour =
    hourlyEvents.length > 0
      ? hourlyEvents.reduce((prev, curr) =>
          curr.events > prev.events ? curr : prev,
        ).hour
      : "--:--";

  const monthlyIncrease = computeMonthlyIncrease(chronologicalMonths);
  const riskScore = Number(
    Math.min(
      10,
      ((fatigueAlerts * 1.5 + speedIncidents * 1.2 + panicIncidents * 2) /
        Math.max(totalEvents, 1)) *
        2,
    ).toFixed(1),
  );

  return {
    events,
    hourlyEvents,
    topDrivers,
    fatigueByHour,
    behaviors,
    monthlyRanking,
    metrics: {
      totalEvents,
      activeDrivers: driverMap.size,
      peakHour,
      riskScore,
      monthlyIncrease,
      fatigueAlerts,
    },
  };
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(emptyDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const supabase = getSupabaseClient();
        const { data: rows, error: queryError } = await supabase
          .from<DadosVeiculoRow>(TABLE_NAME)
          .select(columnSelection)
          .order("data_hora_local", { ascending: false })
          .limit(MAX_ROWS);

        if (queryError) {
          throw queryError;
        }

        if (!isMounted) return;

        setData(buildDashboardData(rows ?? []));
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados do Supabase:", err);
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os dados do dashboard.",
        );
        setData(emptyDashboardData);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};
