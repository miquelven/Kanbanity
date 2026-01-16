import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  ListTone,
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

type HeaderAccent = "yellow" | "red" | "green" | "blue";

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
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [listModalTitle, setListModalTitle] = useState("");
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listModalFirstCardTitle, setListModalFirstCardTitle] = useState("");
  const [listModalTone, setListModalTone] = useState<ListTone>("blue");
  const [listModalLabels, setListModalLabels] = useState<Label[]>([]);
  const [headerAccent, setHeaderAccent] = useState<HeaderAccent>("yellow");
  const [activeDragItem, setActiveDragItem] = useState<DragItem>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLabelId, setFilterLabelId] = useState<string | "all">("all");
  const [filterListId, setFilterListId] = useState<string | "all">("all");

  const availableLabels = board.availableLabels ?? [];

  function cardMatchesFilters(card: CardType) {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const matchesTitle = card.title.toLowerCase().includes(query);
      const matchesContent =
        card.content && card.content.toLowerCase().includes(query);
      const matchesLabelText = card.labels.some((label) =>
        label.name.toLowerCase().includes(query)
      );

      if (!matchesTitle && !matchesContent && !matchesLabelText) {
        return false;
      }
    }

    if (
      filterLabelId !== "all" &&
      !card.labels.some((label) => label.id === filterLabelId)
    ) {
      return false;
    }

    return true;
  }

  const hasActiveFilters =
    !!searchQuery || filterLabelId !== "all" || filterListId !== "all";

  const filteredLists = hasActiveFilters
    ? board.lists
        .filter((list) => filterListId === "all" || list.id === filterListId)
        .map((list) => ({
          ...list,
          cards: list.cards.filter((card) => cardMatchesFilters(card)),
        }))
        .filter((list) => list.cards.length > 0)
    : board.lists;

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

  function handleSaveListModal() {
    const trimmedTitle = listModalTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    if (editingListId) {
      updateList(editingListId, {
        title: trimmedTitle,
        tone: listModalTone,
        labels: listModalLabels,
      });
    } else {
      addList(
        trimmedTitle,
        listModalFirstCardTitle,
        listModalTone,
        listModalLabels
      );
    }

    setListModalTitle("");
    setListModalFirstCardTitle("");
    setListModalTone("blue");
    setListModalLabels([]);
    setEditingListId(null);
    setIsListModalOpen(false);
  }

  function handleOpenCreateList() {
    setEditingListId(null);
    setListModalTitle("");
    setListModalFirstCardTitle("");
    setListModalTone("blue");
    setListModalLabels([]);
    setIsListModalOpen(true);
  }

  function handleOpenEditList(listId: string) {
    const list = board.lists.find((l) => l.id === listId);
    if (!list) return;

    setEditingListId(listId);
    setListModalTitle(list.title);
    setListModalFirstCardTitle(""); // No need to show this when editing
    setListModalTone(list.tone || "blue");
    setListModalLabels(list.labels || []);
    setIsListModalOpen(true);
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
      const cardId = String(active.id);
      const list = board.lists.find((l) =>
        l.cards.some((c) => c.id === cardId)
      );
      const card = list?.cards.find((c) => c.id === cardId);
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

  const listTones: ListTone[] = [
    "blue",
    "purple",
    "pink",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
  ];

  const headerAccentClasses: Record<HeaderAccent, string> = {
    yellow: "bg-retro-yellow",
    red: "bg-retro-red",
    green: "bg-retro-green",
    blue: "bg-retro-blue",
  };

  return (
    <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-6 sm:pt-3">
      <motion.header
        className={`mb-6 flex items-center justify-between rounded-3xl border-[4px] border-retro-ink px-6 py-4 shadow-retroPanel ${headerAccentClasses[headerAccent]}`}
        layout
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <h1 className="font-retroHeading text-4xl font-black uppercase tracking-[0.24em] text-retro-ink drop-shadow-sm dark:text-retro-ink">
          {board.title}
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 px-3 py-1 rounded-xl border-2 border-retro-ink bg-retro-paper text-sm font-retroBody text-retro-ink placeholder:text-retro-ink/50 shadow-[2px_2px_0_rgba(0,0,0,1)] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all"
          />
          <div className="flex gap-2">
            {(["red", "green", "blue"] as HeaderAccent[]).map((accent) => {
              const dotColor =
                accent === "red"
                  ? "bg-retro-red"
                  : accent === "green"
                  ? "bg-retro-green"
                  : "bg-retro-blue";

              const isActive = headerAccent === accent;

              return (
                <button
                  key={accent}
                  type="button"
                  onClick={() => setHeaderAccent(accent)}
                  aria-label={`Mudar cor do cabeçalho para ${accent}`}
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-retro-ink shadow-[0_4px_0_rgba(0,0,0,0.7)] transition-all cursor-pointer ${
                    isActive
                      ? "scale-110 shadow-[0_0_0_4px_rgba(0,0,0,0.9)]"
                      : "opacity-80 hover:-translate-y-[1px] hover:opacity-100"
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full ${dotColor} shadow-[0_0_0_2px_rgba(0,0,0,0.5)]`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </motion.header>
      <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterLabelId}
            onChange={(event) =>
              setFilterLabelId(
                event.target.value
                  ? (event.target.value as string | "all")
                  : "all"
              )
            }
            className="rounded-full border-2 border-retro-ink/50 bg-retro-paper px-3 py-2 text-xs font-retroBody text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-retro-accent"
          >
            <option value="all">Todas as labels</option>
            {availableLabels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>
          <select
            value={filterListId}
            onChange={(event) =>
              setFilterListId(
                event.target.value
                  ? (event.target.value as string | "all")
                  : "all"
              )
            }
            className="rounded-full border-2 border-retro-ink/50 bg-retro-paper px-3 py-2 text-xs font-retroBody text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-retro-accent"
          >
            <option value="all">Todas as listas</option>
            {board.lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleOpenCreateList}
            className="inline-flex items-center gap-2 rounded-full border-2 border-retro-ink bg-retro-accent px-6 py-3 text-sm font-black uppercase tracking-[0.22em] text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.8)] transition-all hover:-translate-y-[1px] hover:bg-retro-accentSoft hover:shadow-[0_1px_0_rgba(0,0,0,0.8)] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Nova lista</span>
          </button>
        </div>
      </section>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={filteredLists.map((list) => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            {filteredLists.map((list, index) => (
              <List
                key={list.id}
                {...list}
                tone={list.tone ?? listTones[index % listTones.length]}
                onStartAddCard={(listId) => setNewCardListId(listId)}
                onDeleteCard={requestDeleteCard}
                onDeleteList={requestDeleteList}
                onEditList={handleOpenEditList}
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
                  tone="accent"
                  onStartAddCard={() => {}}
                  onDeleteCard={() => {}}
                  onDeleteList={() => {}}
                  onEditList={() => {}}
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
            availableLabels={availableLabels}
            onCreateLabel={(label) => addLabel(label)}
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
            availableLabels={availableLabels}
            onCreateLabel={(label) => addLabel(label)}
            onClose={() => setNewCardListId(null)}
            onSave={(data) => {
              addCard(newCardListId, data);
              setNewCardListId(null);
            }}
          />
        )}
        {isListModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-md rounded-3xl border-[4px] border-retro-ink bg-retro-paper p-6 text-retro-ink shadow-retroPanel dark:border-retro-darkFrame/80 dark:bg-retro-darkSurface dark:text-retro-paper max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-retroHeading text-base font-black uppercase tracking-[0.22em] text-retro-ink dark:text-retro-paper">
                  {editingListId ? "Editar lista" : "Nova lista"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="rounded-full border-2 border-retro-ink/40 px-2 py-1 text-sm text-retro-ink/80 transition-colors hover:bg-retro-yellow hover:text-retro-ink dark:border-retro-darkFrame dark:text-retro-paper/80 dark:hover:bg-retro-darkSurface dark:hover:text-retro-paper cursor-pointer"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
                    Título da lista
                  </label>
                  <input
                    value={listModalTitle}
                    onChange={(event) => setListModalTitle(event.target.value)}
                    placeholder="Por exemplo: Em andamento"
                    className="w-full rounded-2xl border-[2px] border-retro-ink bg-retro-paper px-3 py-2 text-sm text-retro-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-retro-accent dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:focus:ring-retro-accentSoft"
                  />
                </div>
                {!editingListId && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
                      Primeiro cartão (opcional)
                    </label>
                    <input
                      value={listModalFirstCardTitle}
                      onChange={(event) =>
                        setListModalFirstCardTitle(event.target.value)
                      }
                      placeholder="Título do primeiro cartão"
                      className="w-full rounded-2xl border-[2px] border-retro-ink bg-retro-paper px-3 py-2 text-sm text-retro-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-retro-accent dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:focus:ring-retro-accentSoft"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
                    Tags da lista
                  </label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {listModalLabels.map((label) => (
                      <span
                        key={label.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wider ${label.color} border border-retro-ink/20`}
                      >
                        {label.name}
                        <button
                          type="button"
                          onClick={() =>
                            setListModalLabels(
                              listModalLabels.filter((l) => l.id !== label.id)
                            )
                          }
                          className="ml-1 rounded-full bg-black/10 p-0.5 hover:bg-black/20"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableLabels
                      .filter(
                        (label) =>
                          !listModalLabels.some((l) => l.id === label.id)
                      )
                      .map((label) => (
                        <button
                          key={label.id}
                          type="button"
                          onClick={() =>
                            setListModalLabels([...listModalLabels, label])
                          }
                          className={`rounded-full border px-2 py-1 text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity ${label.color} border-retro-ink/20`}
                        >
                          {label.name}
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
                    Cor da lista
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {listTones.map((tone) => {
                      const toneLabelMap: Record<ListTone, string> = {
                        blue: "Azul",
                        purple: "Roxo",
                        pink: "Rosa",
                        red: "Vermelho",
                        orange: "Laranja",
                        yellow: "Amarelo",
                        green: "Verde",
                        teal: "Verde-água",
                        accent: "Destaque",
                      };

                      const toneBgMap: Record<ListTone, string> = {
                        blue: "bg-retro-blue",
                        purple: "bg-retro-purple",
                        pink: "bg-retro-pink",
                        red: "bg-retro-red",
                        orange: "bg-retro-orange",
                        yellow: "bg-retro-yellow",
                        green: "bg-retro-green",
                        teal: "bg-retro-teal",
                        accent: "bg-retro-accent",
                      };

                      const isSelected = listModalTone === tone;

                      return (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setListModalTone(tone)}
                          className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-retro-ink shadow-[0_2px_0_rgba(0,0,0,0.6)] transition-all cursor-pointer ${
                            toneBgMap[tone]
                          } ${
                            isSelected
                              ? "ring-2 ring-retro-ink ring-offset-2 ring-offset-retro-paper"
                              : "opacity-80 hover:opacity-100"
                          }`}
                        >
                          <span className="h-3 w-3 rounded-full border border-retro-ink bg-retro-paper/40" />
                          <span>{toneLabelMap[tone]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsListModalOpen(false);
                    setListModalTitle("");
                    setListModalFirstCardTitle("");
                    setListModalLabels([]);
                  }}
                  className="rounded-full border-2 border-retro-ink/40 px-3 py-2 text-sm font-black text-retro-ink/80 shadow-[0_3px_0_rgba(0,0,0,0.5)] transition-all hover:-translate-y-[1px] hover:bg-retro-frame/40 hover:shadow-[0_1px_0_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none dark:border-retro-darkFrame dark:text-retro-paper/80 dark:hover:bg-retro-darkSurface cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveListModal}
                  className="rounded-full border-2 border-retro-ink bg-retro-accent px-3 py-2 text-sm font-black uppercase tracking-[0.22em] text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.8)] transition-all hover:-translate-y-[1px] hover:bg-retro-accentSoft hover:shadow-[0_1px_0_rgba(0,0,0,0.8)] active:translate-y-[1px] active:shadow-none dark:border-retro-darkFrame dark:text-retro-ink cursor-pointer"
                >
                  {editingListId ? "Salvar" : "Criar lista"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-lg border-[3px] border-retro-frame bg-retro-paper p-6 text-retro-ink shadow-retroPanel dark:border-zinc-700 dark:bg-zinc-900 dark:text-retro-paper">
              <h2 className="mb-2 font-retroHeading text-base font-semibold tracking-[0.16em] uppercase">
                {deleteTarget.type === "card"
                  ? "Excluir cartão"
                  : "Excluir lista"}
              </h2>
              <p className="mb-4 text-sm text-retro-ink/80 dark:text-retro-paper/80">
                {deleteTarget.type === "card"
                  ? "Tem certeza que deseja excluir este cartão?"
                  : "Tem certeza que deseja excluir esta lista e todos os seus cartões?"}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded border border-retro-ink/30 px-3 py-2 text-sm font-medium text-retro-ink/80 transition-colors hover:bg-retro-frame/40 dark:border-retro-darkFrame dark:text-retro-paper/80 dark:hover:bg-retro-darkSurface cursor-pointer"
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
                  className="rounded border border-retro-ink/40 bg-retro-red px-3 py-2 text-sm font-semibold text-retro-paper shadow-retroCard transition-colors hover:bg-retro-red/80 cursor-pointer"
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
