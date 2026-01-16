import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import type { Card as CardType } from "../types/kanban";
import { forwardRef } from "react";
import { AVAILABLE_LABELS } from "../data/labels";

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
        className={`group relative flex flex-col gap-2 rounded-2xl bg-retro-paper p-4 text-sm shadow-retroCard transition-all hover:-translate-y-1 hover:shadow-retroPanel dark:bg-retro-darkPaper dark:text-retro-paper border-[3px] border-retro-ink ${
          labels.some(
            (label) =>
              label.id === "1" || label.name.toLowerCase() === "urgente"
          )
            ? "ring-2 ring-retro-redDeep bg-retro-red/40"
            : labels.some(
                (label) =>
                  label.id === "2" ||
                  label.name.toLowerCase().includes("prioridade alta")
              )
            ? "ring-2 ring-retro-orangeDeep bg-retro-orange/40"
            : "ring-1 ring-retro-ink/25 dark:ring-retro-darkFrame"
        } ${
          dragOverlay
            ? "cursor-grabbing shadow-xl rotate-2 scale-105"
            : "cursor-grab active:cursor-grabbing"
        }`}
        {...attributes}
        {...listeners}
      >
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => {
              const currentLabel = AVAILABLE_LABELS.find(
                (l) => l.id === label.id
              );
              const colorClass = currentLabel
                ? currentLabel.color
                : label.color;

              const isPrimaryLabel =
                label.id === "1" ||
                label.id === "2" ||
                label.name.toLowerCase() === "urgente" ||
                label.name.toLowerCase().includes("prioridade alta");

              return (
                <span
                  key={label.id}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-black shadow-[0_3px_0_rgba(0,0,0,0.8)] ${colorClass} ${
                    isPrimaryLabel
                      ? "border-2 border-retro-ink ring-2 ring-retro-ink/80 ring-offset-2 ring-offset-retro-paper"
                      : "border-2 border-retro-ink/50"
                  }`}
                >
                  {label.name}
                </span>
              );
            })}
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-black leading-tight text-retro-ink dark:text-retro-paper">
            {title}
          </h4>
          {onDelete && (
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete?.();
              }}
              className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-red text-retro-paper shadow-[0_3px_0_rgba(0,0,0,0.7)] transition-all hover:-translate-y-[1px] hover:shadow-[0_1px_0_rgba(0,0,0,0.7)] active:translate-y-[1px] dark:bg-retro-red/80"
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
          <p className="line-clamp-2 text-[11px] leading-snug text-retro-ink/80 dark:text-retro-paper/80">
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
            className="rounded-full border-2 border-retro-ink bg-retro-accent px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.8)] transition-all hover:-translate-y-[1px] hover:bg-retro-accentSoft hover:shadow-[0_1px_0_rgba(0,0,0,0.8)] active:translate-y-[1px] active:shadow-none"
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
