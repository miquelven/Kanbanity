import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  defaultDropAnimationSideEffects,
  type DropAnimation,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type {
  Board as BoardType,
  Card as CardType,
  Label,
  List as ListType,
} from "../types/kanban";
import { usePersistentState } from "../hooks/usePersistentState";
import { List, ListContent } from "./List";
import { CardModal } from "./CardModal";
import { CardContent } from "./Card";
import { createPortal } from "react-dom";

type BoardProps = BoardType;

type SelectedCard = {
  listId: string;
  cardId: string;
} | null;

type DeleteTarget =
  | { type: "list"; listId: string }
  | { type: "card"; listId: string; cardId: string }
  | null;

type DragItem =
  | { type: "List"; data: ListType }
  | { type: "Card"; data: CardType & { listId: string } }
  | null;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({}),
};

export function Board(props: BoardProps) {
  const [board, setBoard] = usePersistentState<BoardType>(
    "kanbanity-board",
    props
  );

  const [selectedCard, setSelectedCard] = useState<SelectedCard>(null);
  const [newCardListId, setNewCardListId] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeDragItem, setActiveDragItem] = useState<DragItem>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
    setBoard((currentBoard) => ({
      ...currentBoard,
      lists: currentBoard.lists.filter((list) => list.id !== listId),
    }));
  }

  function addCard(
    listId: string,
    data: { title: string; content?: string; labels: Label[] }
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
            },
          ],
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

  function requestDeleteList(listId: string) {
    setDeleteTarget({ type: "list", listId });
  }

  function requestDeleteCard(listId: string, cardId: string) {
    setDeleteTarget({ type: "card", listId, cardId });
  }

  function updateCard(
    listId: string,
    cardId: string,
    newData: Partial<CardType>
  ) {
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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeType = active.data.current?.type;

    if (activeType === "List") {
      const list = board.lists.find((l) => l.id === active.id);
      if (list) {
        setActiveDragItem({ type: "List", data: list });
      }
      return;
    }

    if (activeType === "Card") {
      const listId = active.data.current?.listId;
      const list = board.lists.find((l) => l.id === listId);
      const card = list?.cards.find((c) => c.id === active.id);
      if (card && list) {
        setActiveDragItem({ type: "Card", data: { ...card, listId: list.id } });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragItem(null);
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "List" && overType === "List") {
      if (active.id === over.id) {
        return;
      }

      setBoard((currentBoard) => {
        const oldIndex = currentBoard.lists.findIndex(
          (list) => list.id === active.id
        );
        const newIndex = currentBoard.lists.findIndex(
          (list) => list.id === over.id
        );

        if (oldIndex === -1 || newIndex === -1) {
          return currentBoard;
        }

        return {
          ...currentBoard,
          lists: arrayMove(currentBoard.lists, oldIndex, newIndex),
        };
      });

      return;
    }

    if (activeType === "Card") {
      const activeCardId = String(active.id);
      const overId = String(over.id);
      const sourceListId = active.data.current?.listId as string;

      let destinationListId: string;

      if (overType === "Card") {
        destinationListId = over.data.current?.listId as string;
      } else if (overType === "List") {
        destinationListId = String(over.id);
      } else {
        destinationListId = sourceListId;
      }

      if (sourceListId === destinationListId && active.id === over.id) {
        return;
      }

      setBoard((currentBoard) => {
        const sourceListIndex = currentBoard.lists.findIndex(
          (list) => list.id === sourceListId
        );
        const destinationListIndex = currentBoard.lists.findIndex(
          (list) => list.id === destinationListId
        );

        if (sourceListIndex === -1 || destinationListIndex === -1) {
          return currentBoard;
        }

        const sourceList = currentBoard.lists[sourceListIndex];
        const destinationList = currentBoard.lists[destinationListIndex];

        const sourceCards = [...sourceList.cards];
        const activeCardIndex = sourceCards.findIndex(
          (card) => card.id === activeCardId
        );

        if (activeCardIndex === -1) {
          return currentBoard;
        }

        if (sourceListId === destinationListId) {
          const destinationCards = [...sourceCards];

          const overCardIndex =
            overType === "Card"
              ? destinationCards.findIndex((card) => card.id === overId)
              : destinationCards.length - 1;

          if (overCardIndex === -1) {
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

        const destinationCards = [...destinationList.cards];
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={board.lists.map((list) => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => (
              <List
                key={list.id}
                {...list}
                onStartAddCard={(listId) => setNewCardListId(listId)}
                onDeleteCard={requestDeleteCard}
                onDeleteList={requestDeleteList}
                onOpenCard={(listId, cardId) =>
                  setSelectedCard({ listId, cardId })
                }
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeDragItem ? (
              activeDragItem.type === "Card" ? (
                <CardContent {...activeDragItem.data} dragOverlay />
              ) : (
                <ListContent
                  {...activeDragItem.data}
                  onStartAddCard={() => {}}
                  onDeleteCard={() => {}}
                  onDeleteList={() => {}}
                  onOpenCard={() => {}}
                  dragOverlay
                />
              )
            ) : null}
          </DragOverlay>,
          document.body
        )}
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
        {newCardListId && (
          <CardModal
            card={{
              id: "new",
              title: "",
              labels: [],
            }}
            onClose={() => setNewCardListId(null)}
            onSave={(data) => {
              addCard(newCardListId, data);
              setNewCardListId(null);
            }}
          />
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 text-slate-900 shadow-xl dark:bg-slate-800 dark:text-slate-100">
              <h2 className="mb-2 text-base font-semibold">
                {deleteTarget.type === "card"
                  ? "Excluir cartão"
                  : "Excluir lista"}
              </h2>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                {deleteTarget.type === "card"
                  ? "Tem certeza que deseja excluir este cartão?"
                  : "Tem certeza que deseja excluir esta lista e todos os seus cartões?"}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!deleteTarget) {
                      return;
                    }
                    if (deleteTarget.type === "card") {
                      deleteCard(deleteTarget.listId, deleteTarget.cardId);
                    } else {
                      deleteList(deleteTarget.listId);
                    }
                    setDeleteTarget(null);
                  }}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
