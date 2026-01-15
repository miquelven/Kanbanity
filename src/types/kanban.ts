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
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}
