// Horarios disponiveis para agendamento de visitas.
//
// Edite este arquivo para alterar a janela de atendimento.
// Cada slot tem um value no formato 24h "HH:MM" e o periodo do dia
// (usado apenas como rotulo na UI).
//
// Recomendacoes:
// - manter slots em incrementos de 1 hora (visitas tipicas duram 60 min)
// - evitar horarios fora do expediente comercial (08h-19h)
// - dois clientes nao podem agendar o mesmo slot no mesmo imovel:
//   o backend (POST /api/schedule) recusa com 409 SLOT_TAKEN se houver
//   conflito; a UI marca os slots ja reservados como indisponiveis.

export const TIME_SLOTS = [
  { value: '09:00', period: 'Manha' },
  { value: '10:00', period: 'Manha' },
  { value: '11:00', period: 'Manha' },
  { value: '14:00', period: 'Tarde' },
  { value: '15:00', period: 'Tarde' },
  { value: '16:00', period: 'Tarde' },
  { value: '17:00', period: 'Tarde' },
  { value: '18:00', period: 'Tarde' },
];

export const PERIODS = ['Manha', 'Tarde'];
