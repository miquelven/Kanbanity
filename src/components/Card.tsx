import { useSortable } from "@dnd-kit/sortable";
import type { Card as CardType } from "../types/kanban";

type CardProps = CardType & {
  onDelete?: () => void;
};

export function Card({ id, title, content, onDelete }: CardProps) {
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
    <div
      ref={setNodeRef}
      style={style}
      className="group mb-2 cursor-grab rounded-lg bg-white p-3 shadow active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
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
            className="hidden rounded p-1 text-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-700 group-hover:inline-flex"
          >
            ×
          </button>
        )}
      </div>
      {content && <p className="mt-1 text-xs text-gray-600">{content}</p>}
    </div>
  );
}
