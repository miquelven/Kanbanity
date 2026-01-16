import { useState } from "react";
import { motion } from "framer-motion";
import type { Card, Label } from "../types/kanban";

type CardModalProps = {
  card: Card;
  availableLabels: Label[];
  onCreateLabel: (label: { name: string; color: string }) => void;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content?: string;
    labels: Label[];
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  }) => void;
};

const LABEL_COLORS = [
  "bg-retro-red",
  "bg-retro-blue",
  "bg-retro-green",
  "bg-retro-yellow",
  "bg-retro-purple",
  "bg-retro-orange",
  "bg-retro-pink",
  "bg-retro-teal",
  "bg-retro-ink",
];

export function CardModal({
  card,
  availableLabels,
  onCreateLabel,
  onClose,
  onSave,
}: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content ?? "");
  const [dueDate, setDueDate] = useState(card.dueDate ?? "");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | undefined
  >(card.priority);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(
    card.labels || []
  );
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);

  function handleCreateLabel() {
    if (!newLabelName.trim()) return;
    onCreateLabel({ name: newLabelName, color: newLabelColor });
    setNewLabelName("");
    setIsCreatingLabel(false);
  }

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onSave({
      title: trimmedTitle,
      content: content.trim() || undefined,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
      priority,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="w-full max-w-xl rounded-3xl border-[4px] border-retro-ink bg-retro-paper p-7 text-retro-ink shadow-retroPanel dark:border-retro-darkFrame/80 dark:bg-retro-darkSurface dark:text-retro-paper"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-retroHeading text-lg font-black uppercase tracking-[0.22em] text-retro-ink dark:text-retro-paper">
            Detalhes do cartão
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-retro-ink/40 px-2 py-1 text-sm text-retro-ink/80 transition-colors hover:bg-retro-yellow hover:text-retro-ink dark:border-retro-darkFrame dark:text-retro-paper/80 dark:hover:bg-retro-darkSurface dark:hover:text-retro-paper cursor-pointer"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
              Título
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border-[2px] border-retro-ink bg-retro-paper px-3 py-2 text-sm text-retro-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-retro-accent dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:focus:ring-retro-accentSoft"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
              Descrição
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border-[2px] border-retro-ink bg-retro-paper px-3 py-2 text-sm text-retro-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-retro-accent dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:focus:ring-retro-accentSoft"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border-[2px] border-retro-ink bg-retro-paper px-3 py-2 text-sm text-retro-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-retro-accent dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:focus:ring-retro-accentSoft"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
                Prioridade
              </label>
              <select
                value={priority || ""}
                onChange={(e) =>
                  setPriority(
                    (e.target.value as "low" | "medium" | "high" | "") ||
                      undefined
                  )
                }
                className="w-full rounded-2xl border-[2px] border-retro-ink bg-retro-paper px-3 py-2 text-sm text-retro-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-retro-accent dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:focus:ring-retro-accentSoft"
              >
                <option value="">Nenhuma</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-retro-ink/80 dark:text-retro-paper/80">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableLabels.map((label) => {
                const isSelected = selectedLabels.some(
                  (l) => l.id === label.id
                );
                const isDarkColor =
                  label.color.includes("ink") || label.color.includes("red");
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label)}
                    className={`rounded-full border-2 px-2 py-1 text-xs font-black uppercase tracking-[0.2em] shadow-sm transition-all cursor-pointer ${
                      isSelected
                        ? `${label.color} border-retro-ink/80 ${
                            isDarkColor ? "text-retro-paper" : "text-retro-ink"
                          } ring-1 ring-retro-ink/70 ring-offset-1 ring-offset-retro-paper dark:border-retro-paper/80 dark:ring-retro-paper/70 dark:ring-offset-retro-darkSurface`
                        : `border-retro-ink/25 bg-retro-paper text-retro-ink/70 hover:border-retro-ink/60 hover:text-retro-ink dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper/70 dark:hover:border-retro-paper/80 dark:hover:text-retro-paper`
                    }`}
                  >
                    {label.name}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCreatingLabel(!isCreatingLabel)}
                className="rounded-full border-2 border-dashed border-retro-ink/40 px-2 py-1 text-xs font-bold uppercase tracking-wider text-retro-ink/60 hover:border-retro-ink hover:text-retro-ink transition-colors cursor-pointer"
              >
                + Nova Tag
              </button>
            </div>

            {isCreatingLabel && (
              <div className="rounded-2xl border-2 border-retro-ink/20 bg-retro-ink/5 p-3 dark:border-retro-paper/20 dark:bg-retro-paper/5">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome da tag"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    className="flex-1 rounded-lg border-2 border-retro-ink/20 bg-retro-paper px-2 py-1 text-xs text-retro-ink focus:border-retro-accent focus:outline-none dark:bg-retro-darkPaper dark:text-retro-paper"
                  />
                  <button
                    type="button"
                    onClick={handleCreateLabel}
                    disabled={!newLabelName.trim()}
                    className="rounded-lg bg-retro-ink px-3 py-1 text-xs font-bold text-retro-paper disabled:opacity-50 dark:bg-retro-paper dark:text-retro-ink"
                  >
                    OK
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LABEL_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewLabelColor(color)}
                      className={`h-5 w-5 rounded-full border-2 ${color} ${
                        newLabelColor === color
                          ? "border-retro-ink scale-110 ring-1 ring-retro-ink ring-offset-1 dark:border-retro-paper dark:ring-retro-paper"
                          : "border-transparent hover:scale-110"
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-retro-ink/40 px-3 py-2 text-sm font-black text-retro-ink/80 shadow-[0_3px_0_rgba(0,0,0,0.5)] transition-all hover:-translate-y-[1px] hover:bg-retro-frame/40 hover:shadow-[0_1px_0_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none dark:border-retro-darkFrame dark:text-retro-paper/80 dark:hover:bg-retro-darkSurface cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full border-2 border-retro-ink bg-retro-accent px-3 py-2 text-sm font-black uppercase tracking-[0.22em] text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.8)] transition-all hover:-translate-y-[1px] hover:bg-retro-accentSoft hover:shadow-[0_1px_0_rgba(0,0,0,0.8)] active:translate-y-[1px] active:shadow-none dark:border-retro-darkFrame dark:text-retro-ink cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
