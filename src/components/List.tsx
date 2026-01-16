import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { List as ListType } from "../types/kanban";
import { Card } from "./Card";
import { forwardRef } from "react";

type ListTone =
  | "accent"
  | "teal"
  | "red"
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "pink"
  | "yellow";

type ListProps = ListType & {
  tone: ListTone;
  onStartAddCard: (listId: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
  onOpenCard: (listId: string, cardId: string) => void;
};

interface ListContentProps extends ListProps {
  dragOverlay?: boolean;
  style?: React.CSSProperties;
  attributes?: ReturnType<typeof useSortable>["attributes"];
  listeners?: ReturnType<typeof useSortable>["listeners"];
}

export const ListContent = forwardRef<HTMLDivElement, ListContentProps>(
  (
    {
      id,
      title,
      cards,
      tone,
      onStartAddCard,
      onDeleteCard,
      onDeleteList,
      onOpenCard,
      style,
      attributes,
      listeners,
      dragOverlay,
    },
    ref
  ) => {
    const tonePanelClasses: Record<ListTone, string> = {
      accent: "border-retro-accent bg-retro-paper/95",
      teal: "border-retro-teal bg-retro-paper/95",
      red: "border-retro-red bg-retro-paper/95",
      blue: "border-retro-blue bg-retro-paper/95",
      purple: "border-retro-purple bg-retro-paper/95",
      green: "border-retro-green bg-retro-paper/95",
      orange: "border-retro-orange bg-retro-paper/95",
      pink: "border-retro-pink bg-retro-paper/95",
      yellow: "border-retro-yellow bg-retro-paper/95",
    };

    const toneHeaderClasses: Record<ListTone, string> = {
      accent: "bg-retro-accent text-retro-ink",
      teal: "bg-retro-teal text-retro-ink",
      red: "bg-retro-red text-retro-ink",
      blue: "bg-retro-blue text-retro-ink",
      purple: "bg-retro-purple text-retro-ink",
      green: "bg-retro-green text-retro-ink",
      orange: "bg-retro-orange text-retro-ink",
      pink: "bg-retro-pink text-retro-ink",
      yellow: "bg-retro-yellow text-retro-ink",
    };

    const toneAddButtonClasses: Record<ListTone, string> = {
      accent:
        "border-2 border-retro-ink bg-retro-accent text-retro-ink hover:bg-retro-accentSoft",
      teal: "border-2 border-retro-ink bg-retro-teal text-retro-ink hover:bg-retro-teal/80",
      red: "border-2 border-retro-ink bg-retro-red text-retro-ink hover:bg-retro-red/80",
      blue: "border-2 border-retro-ink bg-retro-blue text-retro-ink hover:bg-retro-blue/80",
      purple:
        "border-2 border-retro-ink bg-retro-purple text-retro-ink hover:bg-retro-purple/80",
      green:
        "border-2 border-retro-ink bg-retro-green text-retro-ink hover:bg-retro-green/80",
      orange:
        "border-2 border-retro-ink bg-retro-orange text-retro-ink hover:bg-retro-orange/80",
      pink: "border-2 border-retro-ink bg-retro-pink text-retro-ink hover:bg-retro-pink/80",
      yellow:
        "border-2 border-retro-ink bg-retro-yellow text-retro-ink hover:bg-retro-yellow/80",
    };

    return (
      <div
        ref={ref}
        style={style}
        className={`flex w-72 flex-col gap-2 rounded-3xl border-[4px] shadow-retroCard transition-all ${
          tonePanelClasses[tone]
        } ${
          dragOverlay
            ? "rotate-2 scale-105 cursor-grabbing shadow-retroPanel"
            : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className={`flex cursor-grab items-center justify-between rounded-t-3xl px-3 py-3 active:cursor-grabbing shadow-[0_4px_0_rgba(0,0,0,0.4)] ${toneHeaderClasses[tone]}`}
        >
          <h3 className="text-sm font-black uppercase tracking-[0.18em]">
            {title}
          </h3>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDeleteList(id)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-retro-ink transition-colors hover:bg-white/40"
            aria-label="Deletar lista"
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
        </div>

        <div className="flex flex-col gap-2 p-2">
          {!dragOverlay ? (
            <SortableContext
              items={cards.map((card) => card.id)}
              id={id}
              strategy={verticalListSortingStrategy}
            >
              {cards.map((card) => (
                <Card
                  key={card.id}
                  {...card}
                  listId={id}
                  onDelete={() => onDeleteCard(id, card.id)}
                  onOpen={() => onOpenCard(id, card.id)}
                />
              ))}
            </SortableContext>
          ) : (
            cards.map((card) => (
              <Card
                key={card.id}
                {...card}
                listId={id}
                onDelete={() => onDeleteCard(id, card.id)}
                onOpen={() => onOpenCard(id, card.id)}
              />
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onStartAddCard(id)}
          className={`mx-2 mb-3 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.8)] transition-all hover:-translate-y-[1px] hover:shadow-[0_1px_0_rgba(0,0,0,0.8)] active:translate-y-[1px] active:shadow-none ${toneAddButtonClasses[tone]}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Adicionar cartão
        </button>
      </div>
    );
  }
);

export function List({
  id,
  title,
  cards,
  tone,
  onStartAddCard,
  onDeleteCard,
  onDeleteList,
  onOpenCard,
}: ListProps) {
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
      type: "List",
      list: { id, title },
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <ListContent
      ref={setNodeRef}
      id={id}
      title={title}
      cards={cards}
      tone={tone}
      onStartAddCard={onStartAddCard}
      onDeleteCard={onDeleteCard}
      onDeleteList={onDeleteList}
      onOpenCard={onOpenCard}
      style={style}
      attributes={attributes}
      listeners={listeners}
    />
  );
}
