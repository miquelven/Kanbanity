import type { Board } from "../types/kanban";
import { AVAILABLE_LABELS } from "./labels";

export const initialBoard: Board = {
  id: "board-1",
  title: "Quadro Kanban",
  lists: [
    {
      id: "list-1",
      title: "A Fazer",
      tone: "blue",
      cards: [
        {
          id: "card-1",
          title: "Configurar projeto Kanbanity",
          content:
            "Criar estrutura inicial com Vite, React, TypeScript e Tailwind",
          labels: [AVAILABLE_LABELS[0], AVAILABLE_LABELS[5]], // Urgente, Feature
        },
        {
          id: "card-2",
          title: "Definir modelos de dados",
          content: "Criar tipos para Board, List e Card",
          labels: [AVAILABLE_LABELS[7]], // DevOps
        },
      ],
    },
    {
      id: "list-2",
      title: "Em Progresso",
      tone: "orange",
      cards: [
        {
          id: "card-3",
          title: "Implementar UI básica do board",
          content: "Exibir listas e cards usando os dados iniciais",
          labels: [AVAILABLE_LABELS[1]], // Prioridade Alta
        },
      ],
    },
    {
      id: "list-3",
      title: "Concluído",
      tone: "green",
      cards: [
        {
          id: "card-4",
          title: "Criar repositório no GitHub",
          labels: [],
        },
        {
          id: "card-5",
          title: "Commit inicial do projeto",
          labels: [],
        },
      ],
    },
  ],
};
