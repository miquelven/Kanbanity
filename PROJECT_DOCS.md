# Kanbanity - Documentação do Projeto

## 📋 Visão Geral

Kanbanity é uma aplicação de gerenciamento de tarefas estilo Kanban, construída com foco em interatividade fluida e um design visual distinto "Retro/Cartoon". O projeto oferece funcionalidades completas de organização de tarefas com uma experiência de usuário divertida e responsiva.

## 🛠️ Tech Stack

### Core

- **React 19**: Biblioteca UI principal.
- **TypeScript**: Tipagem estática para robustez e segurança.
- **Vite**: Build tool e servidor de desenvolvimento ultrarrápido.

### Estilização e UI

- **Tailwind CSS 4**: Framework de CSS utility-first para estilização rápida.
- **Design System Personalizado**: Configuração estendida do Tailwind (`tailwind.config.js`) com paleta de cores `retro`, fontes personalizadas (`Bangers`, `Comic Sans`) e sombras "hard" para efeito cartoon.

### Interatividade e Animações

- **@dnd-kit**: Biblioteca moderna e leve para funcionalidades de Drag-and-Drop (arrastar e soltar) acessíveis.
  - `@dnd-kit/core`: Lógica central de arrastar.
  - `@dnd-kit/sortable`: Primitivos para listas reordenáveis.
- **Framer Motion**: Biblioteca poderosa para animações complexas e gestos (modais, transições de layout, interações de clique).

### Qualidade de Código

- **ESLint**: Linter para manter consistência e encontrar erros.

## ✨ Funcionalidades (Features)

### Gerenciamento de Tarefas

- **Quadros (Boards)**: Visualização principal estilo Kanban.
- **Listas (Lists)**:
  - Criação dinâmica de novas listas.
  - Personalização de "tom" (cor base) da lista ao criar.
  - Reordenação de listas via arrastar e soltar.
- **Cartões (Cards)**:
  - Criação rápida de cartões dentro das listas.
  - Reordenação de cartões dentro da mesma lista ou entre listas diferentes.
  - **Edição Detalhada**: Clique em um cartão para abrir um modal expandido.
    - Título e Descrição (Rich Text/Markdown support implícito via textarea).
    - **Labels**: Adição de etiquetas coloridas.
    - **Checklists**: Criação de sub-tarefas dentro de um cartão.

### Interatividade Avançada

- **Drag & Drop Robusto**:
  - Feedback visual durante o arraste (rotação, escala, mudança de cursor).
  - Overlay personalizado para itens sendo arrastados.
  - Detecção inteligente de colisão (`closestCorners`).
- **Animações**:
  - Transições suaves ao adicionar/remover itens.
  - Feedback tátil em botões e elementos interativos (ex: círculos do header).
- **Lixeira**: Área de drop dedicada para excluir itens arrastando-os.

### Persistência e Estado

- **Armazenamento Local (LocalStorage)**:
  - Todo o estado do board (`kanbanity-board`) é salvo automaticamente no navegador.
  - O tema escolhido (`kanbanity-theme`) também é persistido.
- **Custom Hooks**: `usePersistentState` para gerenciar sincronização com localStorage.

### Temas

- **Tema Retro/Cartoon**: Identidade visual forte com bordas grossas, sombras sólidas e cores vibrantes.
- **Dark Mode**: Suporte a alternância entre tema claro e escuro (implementado via `ThemeContext` e classes Tailwind `dark:`).

## 📂 Estrutura do Projeto

```
src/
├── assets/             # Recursos estáticos (imagens, svgs)
├── components/         # Componentes React reutilizáveis
│   ├── Board.tsx       # Componente principal e lógica de DnD
│   ├── List.tsx        # Componente de coluna/lista
│   ├── Card.tsx        # Componente de cartão individual
│   ├── CardModal.tsx   # Modal de edição de detalhes do cartão
│   └── ThemeToggle.tsx # Botão de troca de tema
├── contexts/           # Contextos React (Estado global)
│   └── ThemeContext.tsx
├── data/               # Dados estáticos e iniciais
│   ├── initial-data.ts # Mock data para primeira execução
│   └── labels.ts       # Cores e opções de etiquetas
├── hooks/              # Custom Hooks
│   └── usePersistentState.ts
├── types/              # Definições de tipos TypeScript
│   └── kanban.ts       # Interfaces principais (Board, List, Card)
├── App.tsx             # Componente raiz
└── main.tsx            # Ponto de entrada da aplicação
```

## 🎨 Design System (Tailwind Config)

O projeto utiliza uma extensão personalizada do Tailwind:

- **Cores**: `retro.paper`, `retro.ink`, `retro.red`, etc.
- **Fontes**:
  - `font-retroHeading`: "Bangers"
  - `font-retroBody`: "Comic Sans MS"
- **Sombras**: `shadow-retroPanel`, `shadow-retroCard` (sombras sólidas sem blur).
