import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import type { Card as CardType } from "../types/kanban";

type CardProps = CardType & {
  onDelete?: () => void;
  onOpen?: () => void;
};

export function Card({
  id,
  title,
  content,
  labels,
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
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="group cursor-grab rounded-lg bg-white p-3 shadow active:cursor-grabbing"
      {...attributes}
      {...listeners}
      onClick={() => onOpen?.()}
    >
      {labels && labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {labels.map((label) => (
            <span
              key={label.id}
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${label.color}`}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <div className="mb-1 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
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
            className="hidden rounded p-1 text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-700 group-hover:inline-flex dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            ×
          </button>
        )}
      </div>
      {content && (
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          {content}
        </p>
      )}
    </motion.div>
  );
}
