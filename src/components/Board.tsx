import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Board as BoardType, Card } from "../types/kanban";
import { usePersistentState } from "../hooks/usePersistentState";
import { List } from "./List";
import { CardModal } from "./CardModal";

type BoardProps = BoardType;

type SelectedCard = {
  listId: string;
  cardId: string;
} | null;

export function Board(props: BoardProps) {
  const [board, setBoard] = usePersistentState<BoardType>(
    "kanbanity-board",
    props
  );

  const [selectedCard, setSelectedCard] = useState<SelectedCard>(null);
  const [newListTitle, setNewListTitle] = useState("");

  function createId(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function addList(title: string) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: [
        ...currentBoard.lists,
        {
          id: createId("list"),
          title: trimmedTitle,
          cards: [],
        },
      ],
    }));

    setNewListTitle("");
  }

  function deleteList(listId: string) {
    if (!window.confirm("Tem certeza que deseja excluir esta lista?")) {
      return;
    }

    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.filter((list) => list.id !== listId),
    }));
  }

  function addCard(listId: string, cardTitle: string) {
    const trimmedTitle = cardTitle.trim();
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
              labels: [],
            },
          ],
        };
      }),
    }));
  }

  function deleteCard(listId: string, cardId: string) {
    if (!window.confirm("Tem certeza que deseja excluir este cartão?")) {
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
          cards: list.cards.filter((card) => card.id !== cardId),
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

  function findListByCardId(cardId: string) {
    return board.lists.find((list) =>
      list.cards.some((card) => card.id === cardId)
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const sourceList = findListByCardId(String(active.id));
    const destinationList = findListByCardId(String(over.id));

    if (!sourceList || !destinationList) {
      return;
    }

    const sourceListIndex = board.lists.findIndex(
      (list) => list.id === sourceList.id
    );
    const destinationListIndex = board.lists.findIndex(
      (list) => list.id === destinationList.id
    );

    const sourceCards = [...sourceList.cards];
    const destinationCards =
      sourceList.id === destinationList.id
        ? sourceCards
        : [...destinationList.cards];

    const activeCardIndex = sourceCards.findIndex(
      (card) => card.id === active.id
    );
    const overCardIndex = destinationCards.findIndex(
      (card) => card.id === over.id
    );

    if (activeCardIndex === -1 || overCardIndex === -1) {
      return;
    }

    if (sourceList.id === destinationList.id) {
      const reorderedCards = arrayMove(
        sourceCards,
        activeCardIndex,
        overCardIndex
      );

      const updatedLists = [...board.lists];
      updatedLists[sourceListIndex] = {
        ...sourceList,
        cards: reorderedCards,
      };

      setBoard({
        ...board,
        lists: updatedLists,
      });

      return;
    }

    const [movedCard] = sourceCards.splice(activeCardIndex, 1);
    const updatedDestinationCards = [...destinationCards];
    updatedDestinationCards.splice(overCardIndex, 0, movedCard);

    const updatedLists = [...board.lists];

    updatedLists[sourceListIndex] = {
      ...sourceList,
      cards: sourceCards,
    };

    updatedLists[destinationListIndex] = {
      ...destinationList,
      cards: updatedDestinationCards,
    };

    setBoard({
      ...board,
      lists: updatedLists,
    });
  }

  const selectedCardData =
    selectedCard &&
    (() => {
      const list = board.lists.find((item) => item.id === selectedCard.listId);
      if (!list) {
        return null;
      }

      const card = list.cards.find((item) => item.id === selectedCard.cardId);
      if (!card) {
        return null;
      }

      return { listId: list.id, card };
    })();

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {board.title}
        </h1>
      </header>
      <section className="mb-4 flex gap-2">
        <input
          value={newListTitle}
          onChange={(event) => setNewListTitle(event.target.value)}
          placeholder="Nova lista"
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={() => addList(newListTitle)}
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Adicionar lista
        </button>
      </section>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={board.lists.map((list) => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => (
              <List
                key={list.id}
                {...list}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onDeleteList={deleteList}
                onOpenCard={(listId, cardId) =>
                  setSelectedCard({ listId, cardId })
                }
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <AnimatePresence>
        {selectedCardData && (
          <CardModal
            card={selectedCardData.card}
            onClose={() => setSelectedCard(null)}
            onSave={(data) => {
              updateCard(
                selectedCardData.listId,
                selectedCardData.card.id,
                data
              );
              setSelectedCard(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
