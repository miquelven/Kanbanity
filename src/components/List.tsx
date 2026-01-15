import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { List as ListType } from "../types/kanban";
import { Card } from "./Card";

type ListProps = ListType & {
  onAddCard: (listId: string, cardTitle: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
};

export function List({
  id,
  title,
  cards,
  onAddCard,
  onDeleteCard,
  onDeleteList,
}: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  function handleAddCard() {
    const trimmedTitle = newCardTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    onAddCard(id, trimmedTitle);
    setNewCardTitle("");
    setIsAddingCard(false);
  }

  return (
    <div className="w-72 flex-shrink-0 rounded-lg bg-slate-100 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={() => onDeleteList(id)}
          className="rounded p-1 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-800"
        >
          ×
        </button>
      </div>
      <SortableContext
        items={cards.map((card) => card.id)}
        id={id}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              onDelete={() => onDeleteCard(id, card.id)}
            />
          ))}
        </div>
      </SortableContext>
      <div className="mt-3">
        {isAddingCard ? (
          <div className="space-y-2">
            <input
              value={newCardTitle}
              onChange={(event) => setNewCardTitle(event.target.value)}
              placeholder="Título do cartão"
              className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddCard}
                className="rounded-md bg-sky-600 px-2 py-1 text-xs font-medium text-white hover:bg-sky-500"
              >
                Adicionar cartão
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Adicionar outro cartão
          </button>
        )}
      </div>
    </div>
  );
}
