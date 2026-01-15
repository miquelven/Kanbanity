import type { Label } from '../types/kanban';

export const AVAILABLE_LABELS: Label[] = [
  { id: '1', name: 'Urgente', color: 'bg-red-500' },
  { id: '2', name: 'Prioridade Alta', color: 'bg-orange-500' },
  { id: '3', name: 'Média', color: 'bg-yellow-500' },
  { id: '4', name: 'Baixa', color: 'bg-green-500' },
  { id: '5', name: 'Bug', color: 'bg-rose-600' },
  { id: '6', name: 'Feature', color: 'bg-blue-500' },
  { id: '7', name: 'Design', color: 'bg-purple-500' },
  { id: '8', name: 'DevOps', color: 'bg-slate-500' },
];
