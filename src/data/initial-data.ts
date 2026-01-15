import type { Board } from '../types/kanban'

export const initialBoard: Board = {
  id: 'board-1',
  title: 'Quadro Kanban',
  lists: [
    {
      id: 'list-1',
      title: 'A Fazer',
      cards: [
        {
          id: 'card-1',
          title: 'Configurar projeto Kanbanity',
          content: 'Criar estrutura inicial com Vite, React, TypeScript e Tailwind'
        },
        {
          id: 'card-2',
          title: 'Definir modelos de dados',
          content: 'Criar tipos para Board, List e Card'
        }
      ]
    },
    {
      id: 'list-2',
      title: 'Em Progresso',
      cards: [
        {
          id: 'card-3',
          title: 'Implementar UI básica do board',
          content: 'Exibir listas e cards usando os dados iniciais'
        }
      ]
    },
    {
      id: 'list-3',
      title: 'Concluído',
      cards: [
        {
          id: 'card-4',
          title: 'Criar repositório no GitHub'
        },
        {
          id: 'card-5',
          title: 'Commit inicial do projeto'
        }
      ]
    }
  ]
}

