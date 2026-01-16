import type { Label } from "../types/kanban";

export const AVAILABLE_LABELS: Label[] = [
  { id: "1", name: "Urgente", color: "bg-retro-redDeep" },
  { id: "2", name: "Prioridade Alta", color: "bg-retro-orangeDeep" },
  { id: "3", name: "Média", color: "bg-retro-yellowDeep" },
  { id: "4", name: "Baixa", color: "bg-retro-greenDeep" },
  { id: "5", name: "Bug", color: "bg-retro-red" },
  { id: "6", name: "Feature", color: "bg-retro-blue" },
  { id: "7", name: "Design", color: "bg-retro-purple" },
  { id: "8", name: "DevOps", color: "bg-retro-pink" },
];
