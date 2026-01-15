import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "framer-motion";
import type { List as ListType } from "../types/kanban";
import { Card } from "./Card";

type ListProps = ListType & {
  onStartAddCard: (listId: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
  onOpenCard: (listId: string, cardId: string) => void;
};

export function List({
  id,
  title,
  cards,
  onStartAddCard,
  onDeleteCard,
  onDeleteList,
  onOpenCard,
}: ListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "List",
      list: { id, title },
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 flex-shrink-0 rounded-lg bg-slate-100 p-4 transition-colors dark:bg-slate-800"
    >
      <div
        {...attributes}
        {...listeners}
        className="mb-3 flex cursor-grab items-center justify-between gap-2 active:cursor-grabbing"
      >
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDeleteList(id)}
          className="rounded p-1 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          ×
        </button>
      </div>
      <SortableContext
        items={cards.map((card) => card.id)}
        id={id}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {cards.map((card) => (
              <Card
                key={card.id}
                {...card}
                listId={id}
                onDelete={() => onDeleteCard(id, card.id)}
                onOpen={() => onOpenCard(id, card.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onStartAddCard(id)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        >
          + Adicionar outro cartão
        </button>
      </div>
    </div>
  );
}
