import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { List as ListType } from "../types/kanban";
import { Card } from "./Card";
import { forwardRef } from "react";

type ListProps = ListType & {
  onStartAddCard: (listId: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
  onOpenCard: (listId: string, cardId: string) => void;
};

interface ListContentProps extends ListProps {
  dragOverlay?: boolean;
  style?: React.CSSProperties;
  attributes?: ReturnType<typeof useSortable>["attributes"];
  listeners?: ReturnType<typeof useSortable>["listeners"];
}

export const ListContent = forwardRef<HTMLDivElement, ListContentProps>(
  (
    {
      id,
      title,
      cards,
      onStartAddCard,
      onDeleteCard,
      onDeleteList,
      onOpenCard,
      style,
      attributes,
      listeners,
      dragOverlay,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`flex w-72 flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800/50 ${
          dragOverlay ? "rotate-2 scale-105 cursor-grabbing shadow-xl" : ""
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex cursor-grab items-center justify-between px-1 py-1 active:cursor-grabbing"
        >
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </h3>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDeleteList(id)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            aria-label="Deletar lista"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {!dragOverlay ? (
            <SortableContext
              items={cards.map((card) => card.id)}
              id={id}
              strategy={verticalListSortingStrategy}
            >
              {cards.map((card) => (
                <Card
                  key={card.id}
                  {...card}
                  listId={id}
                  onDelete={() => onDeleteCard(id, card.id)}
                  onOpen={() => onOpenCard(id, card.id)}
                />
              ))}
            </SortableContext>
          ) : (
            cards.map((card) => (
              <Card
                key={card.id}
                {...card}
                listId={id}
                onDelete={() => onDeleteCard(id, card.id)}
                onOpen={() => onOpenCard(id, card.id)}
              />
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onStartAddCard(id)}
          className="mt-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Adicionar cartão
        </button>
      </div>
    );
  }
);

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
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <ListContent
      ref={setNodeRef}
      id={id}
      title={title}
      cards={cards}
      onStartAddCard={onStartAddCard}
      onDeleteCard={onDeleteCard}
      onDeleteList={onDeleteList}
      onOpenCard={onOpenCard}
      style={style}
      attributes={attributes}
      listeners={listeners}
    />
  );
}
