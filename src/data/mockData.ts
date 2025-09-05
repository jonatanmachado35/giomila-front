export const mockData = {
  // Eventos mais frequentes
  events: [
    { name: 'Frenagem Brusca', count: 342, percentage: 28.5 },
    { name: 'Aceleração Brusca', count: 298, percentage: 24.8 },
    { name: 'Curva Acentuada', count: 187, percentage: 15.6 },
    { name: 'Excesso Velocidade', count: 156, percentage: 13.0 },
    { name: 'Fadiga', count: 98, percentage: 8.2 },
    { name: 'Distração', count: 119, percentage: 9.9 }
  ],

  // Horários com mais eventos
  hourlyEvents: [
    { hour: '06:00', events: 45 },
    { hour: '07:00', events: 78 },
    { hour: '08:00', events: 92 },
    { hour: '09:00', events: 67 },
    { hour: '10:00', events: 54 },
    { hour: '11:00', events: 48 },
    { hour: '12:00', events: 39 },
    { hour: '13:00', events: 43 },
    { hour: '14:00', events: 71 },
    { hour: '15:00', events: 85 },
    { hour: '16:00', events: 89 },
    { hour: '17:00', events: 95 },
    { hour: '18:00', events: 102 },
    { hour: '19:00', events: 76 },
    { hour: '20:00', events: 58 },
    { hour: '21:00', events: 41 },
    { hour: '22:00', events: 32 }
  ],

  // Top motoristas com mais eventos
  topDrivers: [
    { name: 'João Silva', events: 89, mainEvent: 'Frenagem Brusca', badge: 'Atenção' },
    { name: 'Maria Santos', events: 76, mainEvent: 'Aceleração Brusca', badge: 'Moderado' },
    { name: 'Carlos Oliveira', events: 65, mainEvent: 'Excesso Velocidade', badge: 'Alto Risco' },
    { name: 'Ana Costa', events: 54, mainEvent: 'Curva Acentuada', badge: 'Atenção' },
    { name: 'Pedro Lima', events: 43, mainEvent: 'Fadiga', badge: 'Crítico' }
  ],

  // Dados de fadiga por horário
  fatigueByHour: [
    { hour: '06:00', fatigue: 12 },
    { hour: '08:00', fatigue: 8 },
    { hour: '10:00', fatigue: 5 },
    { hour: '12:00', fatigue: 3 },
    { hour: '14:00', fatigue: 7 },
    { hour: '16:00', fatigue: 15 },
    { hour: '18:00', fatigue: 23 },
    { hour: '20:00', fatigue: 18 },
    { hour: '22:00', fatigue: 28 }
  ],

  // Comportamentos mais comuns
  behaviors: [
    { type: 'Uso Celular', count: 234, risk: 'Alto' },
    { type: 'Sonolência', count: 189, risk: 'Crítico' },
    { type: 'Não uso Cinto', count: 156, risk: 'Alto' },
    { type: 'Comer/Beber', count: 98, risk: 'Moderado' },
    { type: 'Olhar Espelho', count: 67, risk: 'Baixo' },
    { type: 'Falso Positivo', count: 21, risk: 'Baixo' }
  ],

  // Dados de ranking mensal
  monthlyRanking: [
    { month: "Dezembro", events: 1200, position: 1, change: "up" as const, changeValue: 2 },
    { month: "Novembro", events: 1156, position: 2, change: "up" as const, changeValue: 1 },
    { month: "Outubro", events: 1089, position: 3, change: "down" as const, changeValue: 1 },
    { month: "Setembro", events: 1234, position: 2, change: "same" as const, changeValue: 0 },
    { month: "Agosto", events: 1345, position: 1, change: "up" as const, changeValue: 3 },
    { month: "Julho", events: 987, position: 4, change: "down" as const, changeValue: 2 }
  ],

  // Métricas gerais
  metrics: {
    totalEvents: 1200,
    activeDrivers: 45,
    peakHour: '18:00',
    riskScore: 7.2,
    monthlyIncrease: 12.5,
    fatigueAlerts: 89
  }
};
