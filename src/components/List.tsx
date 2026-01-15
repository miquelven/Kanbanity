import type { List as ListType } from '../types/kanban'
import { Card } from './Card'

type ListProps = ListType

export function List({ title, cards }: ListProps) {
  return (
    <div className="w-72 flex-shrink-0 rounded-lg bg-slate-100 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <div>
        {cards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  )
}

