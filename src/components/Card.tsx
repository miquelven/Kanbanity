import type { Card as CardType } from "../types/kanban";

type CardProps = CardType;

export function Card({ title, content }: CardProps) {
  return (
    <div className="mb-2 rounded-lg bg-white p-3 shadow">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      {content && <p className="mt-1 text-xs text-gray-600">{content}</p>}
    </div>
  );
}
