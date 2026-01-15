import type { Board as BoardType } from "../types/kanban";
import { List } from "./List";

type BoardProps = BoardType;

export function Board({ title, lists }: BoardProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-slate-50">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      <main className="flex gap-4 overflow-x-auto">
        {lists.map((list) => (
          <List key={list.id} {...list} />
        ))}
      </main>
    </div>
  );
}
