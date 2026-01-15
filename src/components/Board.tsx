import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Board as BoardType } from "../types/kanban";
import { usePersistentState } from "../hooks/usePersistentState";
import { List } from "./List";

type BoardProps = BoardType;

export function Board(props: BoardProps) {
  const [board, setBoard] = usePersistentState<BoardType>(
    "kanbanity-board",
    props
  );

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

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-slate-50">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{board.title}</h1>
      </header>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <main className="flex gap-4 overflow-x-auto">
          {board.lists.map((list) => (
            <List key={list.id} {...list} />
          ))}
        </main>
      </DndContext>
    </div>
  );
}
