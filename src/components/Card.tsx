import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import type { Card as CardType } from "../types/kanban";
import { forwardRef } from "react";

type CardProps = CardType & {
  listId: string;
  onDelete?: () => void;
  onOpen?: () => void;
};

interface CardContentProps extends Omit<CardProps, "listId"> {
  dragOverlay?: boolean;
  style?: React.CSSProperties;
  attributes?: ReturnType<typeof useSortable>["attributes"];
  listeners?: ReturnType<typeof useSortable>["listeners"];
  isDragging?: boolean;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      title,
      content,
      labels,
      onDelete,
      onOpen,
      style,
      attributes,
      listeners,
      dragOverlay,
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        style={style}
        layout={!dragOverlay}
        className={`group relative flex flex-col gap-2 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-700 dark:ring-slate-600 ${
          dragOverlay
            ? "cursor-grabbing shadow-xl rotate-2 scale-105"
            : "cursor-grab active:cursor-grabbing"
        }`}
        {...attributes}
        {...listeners}
      >
        {labels && labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {labels.map((label) => (
              <span
                key={label.id}
                className={`rounded px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm ${label.color}`}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          {onDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (
                  window.confirm("Tem certeza que deseja excluir este cartão?")
                ) {
                  onDelete();
                }
              }}
              className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm transition-all hover:bg-red-200 hover:scale-110 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              aria-label="Deletar cartão"
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
          )}
        </div>
        {content && (
          <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
            {content}
          </p>
        )}
        <div className="mt-1 flex justify-end">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.();
            }}
            className="rounded px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"
          >
            Abrir
          </button>
        </div>
      </motion.div>
    );
  }
);

export function Card({
  id,
  title,
  content,
  labels,
  listId,
  onDelete,
  onOpen,
}: CardProps) {
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
      type: "Card",
      listId,
      card: { id, title, content, labels },
    },
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <CardContent
      ref={setNodeRef}
      id={id}
      title={title}
      content={content}
      labels={labels}
      onDelete={onDelete}
      onOpen={onOpen}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
    />
  );
}
