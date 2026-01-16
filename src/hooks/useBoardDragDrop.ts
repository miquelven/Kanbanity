import { useState } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useBoard } from "../contexts/BoardContext";
import type { List as ListType, Card as CardType } from "../types/kanban";

export type DragItem =
  | { type: "List"; data: ListType }
  | { type: "Card"; data: CardType & { listId: string } }
  | null;

export function useBoardDragDrop() {
  const { board, reorderLists, moveCard } = useBoard();
  const [activeDragItem, setActiveDragItem] = useState<DragItem>(null);

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

    if (activeType === "List" && (overType === "List" || overType === "Card")) {
      const overListId =
        overType === "List" ? over.id : over.data.current?.listId;

      if (active.id === overListId) {
        return;
      }

      const oldIndex = board.lists.findIndex((list) => list.id === active.id);
      const newIndex = board.lists.findIndex((list) => list.id === overListId);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderLists(oldIndex, newIndex);
      }
      return;
    }

    if (activeType === "Card") {
      const activeCardId = String(active.id);
      const overId = String(over.id);

      moveCard(
        activeCardId,
        overId,
        activeType as "Card" | "List",
        overType as "Card" | "List"
      );
    }
  }

  return {
    activeDragItem,
    handleDragStart,
    handleDragEnd,
  };
}
