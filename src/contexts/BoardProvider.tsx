import type { ReactNode } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import type { Board, Card, Label, ListTone } from "../types/kanban";
import { arrayMove } from "@dnd-kit/sortable";
import { BoardContext } from "./BoardContext";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function BoardProvider({
  children,
  initialBoard,
}: {
  children: ReactNode;
  initialBoard: Board;
}) {
  const [board, setBoard] = usePersistentState<Board>(
    "kanbanity-board",
    initialBoard
  );

  function addList(
    title: string,
    firstCardTitle?: string,
    tone?: ListTone,
    labels?: Label[]
  ) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    const trimmedFirstCardTitle = firstCardTitle?.trim();

    setBoard((currentBoard) => {
      const newListId = createId("list");
      const newCards =
        trimmedFirstCardTitle && trimmedFirstCardTitle.length > 0
          ? [
              {
                id: createId("card"),
                title: trimmedFirstCardTitle,
                content: undefined,
                labels: [],
              },
            ]
          : [];

      return {
        ...currentBoard,
        lists: [
          ...currentBoard.lists,
          {
            id: newListId,
            title: trimmedTitle,
            tone: tone ?? "blue",
            cards: newCards,
            labels: labels ?? [],
          },
        ],
      };
    });
  }

  function updateList(
    listId: string,
    data: { title: string; tone: ListTone; labels: Label[] }
  ) {
    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.map((list) =>
        list.id === listId
          ? { ...list, title: data.title, tone: data.tone, labels: data.labels }
          : list
      ),
    }));
  }

  function deleteList(listId: string) {
    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.filter((list) => list.id !== listId),
    }));
  }

  function addCard(
    listId: string,
    data: {
      title: string;
      content?: string;
      labels: Label[];
      dueDate?: string;
      priority?: "low" | "medium" | "high";
    }
  ) {
    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      return;
    }

    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          cards: [
            ...list.cards,
            {
              id: createId("card"),
              title: trimmedTitle,
              content: data.content,
              labels: data.labels,
              dueDate: data.dueDate,
              priority: data.priority,
            },
          ],
        };
      }),
    }));
  }

  function updateCard(listId: string, cardId: string, newData: Partial<Card>) {
    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId ? { ...card, ...newData } : card
          ),
        };
      }),
    }));
  }

  function deleteCard(listId: string, cardId: string) {
    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          cards: list.cards.filter((card) => card.id !== cardId),
        };
      }),
    }));
  }

  function addLabel(label: { name: string; color: string }) {
    const newLabel: Label = {
      id: createId("label"),
      name: label.name,
      color: label.color,
    };
    setBoard((currentBoard) => {
      const existingLabels = Array.isArray(currentBoard.availableLabels)
        ? currentBoard.availableLabels
        : [];

      return {
        ...currentBoard,
        availableLabels: [...existingLabels, newLabel],
      };
    });
  }

  function reorderLists(oldIndex: number, newIndex: number) {
    setBoard((currentBoard) => {
      return {
        ...currentBoard,
        lists: arrayMove(currentBoard.lists, oldIndex, newIndex),
      };
    });
  }

  function moveCard(
    activeCardId: string,
    overId: string,
    _activeType: "Card" | "List",
    overType: "Card" | "List"
  ) {
    setBoard((currentBoard) => {
      const sourceListIndex = currentBoard.lists.findIndex((list) =>
        list.cards.some((card) => card.id === activeCardId)
      );

      if (sourceListIndex === -1) {
        return currentBoard;
      }

      const sourceList = currentBoard.lists[sourceListIndex];
      const sourceCards = [...sourceList.cards];
      const activeCardIndex = sourceCards.findIndex(
        (card) => card.id === activeCardId
      );

      if (activeCardIndex === -1) {
        return currentBoard;
      }

      let destinationListIndex = sourceListIndex;

      if (overType === "Card") {
        const listIndexForOverCard = currentBoard.lists.findIndex((list) =>
          list.cards.some((card) => card.id === overId)
        );
        if (listIndexForOverCard !== -1) {
          destinationListIndex = listIndexForOverCard;
        }
      } else if (overType === "List") {
        const listIndexForOverList = currentBoard.lists.findIndex(
          (list) => list.id === overId
        );
        if (listIndexForOverList !== -1) {
          destinationListIndex = listIndexForOverList;
        }
      }

      const destinationList = currentBoard.lists[destinationListIndex];
      const destinationCards = [...destinationList.cards];

      if (sourceListIndex === destinationListIndex) {
        const overCardIndex =
          overType === "Card"
            ? destinationCards.findIndex((card) => card.id === overId)
            : destinationCards.length - 1;

        if (overCardIndex === -1 || overCardIndex === activeCardIndex) {
          return currentBoard;
        }

        const reorderedCards = arrayMove(
          destinationCards,
          activeCardIndex,
          overCardIndex
        );

        const newLists = [...currentBoard.lists];
        newLists[sourceListIndex] = {
          ...sourceList,
          cards: reorderedCards,
        };

        return {
          ...currentBoard,
          lists: newLists,
        };
      }

      const [movedCard] = sourceCards.splice(activeCardIndex, 1);

      let destinationIndex: number;

      if (overType === "Card") {
        const overCardIndex = destinationCards.findIndex(
          (card) => card.id === overId
        );
        destinationIndex =
          overCardIndex === -1 ? destinationCards.length : overCardIndex;
      } else {
        destinationIndex = destinationCards.length;
      }

      destinationCards.splice(destinationIndex, 0, movedCard);

      const newLists = [...currentBoard.lists];
      newLists[sourceListIndex] = {
        ...sourceList,
        cards: sourceCards,
      };
      newLists[destinationListIndex] = {
        ...destinationList,
        cards: destinationCards,
      };

      return {
        ...currentBoard,
        lists: newLists,
      };
    });
  }

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        addList,
        updateList,
        deleteList,
        addCard,
        updateCard,
        deleteCard,
        addLabel,
        reorderLists,
        moveCard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
