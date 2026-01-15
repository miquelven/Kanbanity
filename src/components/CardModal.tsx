import { useState } from "react";
import type { Card } from "../types/kanban";

type CardModalProps = {
  card: Card;
  onClose: () => void;
  onSave: (data: { title: string; content?: string }) => void;
};

export function CardModal({ card, onClose, onSave }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content ?? "");

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onSave({
      title: trimmedTitle,
      content: content.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 text-slate-900 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Detalhes do cartão</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Título
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Descrição
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
