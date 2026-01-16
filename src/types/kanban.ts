export type ListTone =
  | "accent"
  | "teal"
  | "red"
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "pink"
  | "yellow";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  title: string;
  content?: string;
  labels: Label[];
  dueDate?: string; // ISO string
  priority?: "low" | "medium" | "high";
}

export interface List {
  id: string;
  title: string;
  tone?: ListTone;
  cards: Card[];
  labels?: Label[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  availableLabels: Label[];
}
