import { useState } from "react";
import { motion } from "framer-motion";
import type { Card, Label } from "../types/kanban";
import { AVAILABLE_LABELS } from "../data/labels";

type CardModalProps = {
  card: Card;
  onClose: () => void;
  onSave: (data: { title: string; content?: string; labels: Label[] }) => void;
};

export function CardModal({ card, onClose, onSave }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content ?? "");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(
    card.labels || []
  );

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onSave({
      title: trimmedTitle,
      content: content.trim() || undefined,
      labels: selectedLabels,
    });
  }

  function toggleLabel(label: Label) {
    setSelectedLabels((current) => {
      const isSelected = current.some((l) => l.id === label.id);
      if (isSelected) {
        return current.filter((l) => l.id !== label.id);
      }
      return [...current, label];
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="w-full max-w-lg rounded-lg bg-white p-6 text-slate-900 shadow-xl dark:bg-slate-800 dark:text-slate-100"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Detalhes do cartão</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Título
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Descrição
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LABELS.map((label) => {
                const isSelected = selectedLabels.some(
                  (l) => l.id === label.id
                );
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label)}
                    className={`rounded px-2 py-1 text-xs font-medium text-white transition-all ${
                      label.color
                    } ${
                      isSelected
                        ? "ring-2 ring-slate-600 ring-offset-1 dark:ring-slate-400 dark:ring-offset-slate-800"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {label.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
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
      </motion.div>
    </motion.div>
  );
}
