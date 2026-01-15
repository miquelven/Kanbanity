import { useSortable } from '@dnd-kit/sortable'
import type { Card as CardType } from '../types/kanban'

type CardProps = CardType

export function Card({ id, title, content }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 cursor-grab rounded-lg bg-white p-3 shadow active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      {content && <p className="mt-1 text-xs text-gray-600">{content}</p>}
    </div>
  )
}
