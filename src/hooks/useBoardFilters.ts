import { useState, useMemo } from "react";
import { useBoard } from "../contexts/BoardContext";
import type { Card } from "../types/kanban";

export function useBoardFilters() {
  const { board } = useBoard();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLabelId, setFilterLabelId] = useState<string | "all">("all");
  const [filterListId, setFilterListId] = useState<string | "all">("all");

  const availableLabels = board.availableLabels ?? [];

  const filteredLists = useMemo(() => {
    function cardMatchesFilters(card: Card) {
      const query = searchQuery.trim().toLowerCase();

      if (query) {
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesContent =
          card.content && card.content.toLowerCase().includes(query);
        const matchesLabelText = card.labels.some((label) =>
          label.name.toLowerCase().includes(query)
        );

        if (!matchesTitle && !matchesContent && !matchesLabelText) {
          return false;
        }
      }

      if (
        filterLabelId !== "all" &&
        !card.labels.some((label) => label.id === filterLabelId)
      ) {
        return false;
      }

      return true;
    }

    const hasActiveFilters =
      !!searchQuery || filterLabelId !== "all" || filterListId !== "all";

    return hasActiveFilters
      ? board.lists
          .filter((list) => filterListId === "all" || list.id === filterListId)
          .map((list) => ({
            ...list,
            cards: list.cards.filter((card) => cardMatchesFilters(card)),
          }))
          .filter((list) => list.cards.length > 0)
      : board.lists;
  }, [board.lists, searchQuery, filterLabelId, filterListId]);

  return {
    searchQuery,
    setSearchQuery,
    filterLabelId,
    setFilterLabelId,
    filterListId,
    setFilterListId,
    filteredLists,
    availableLabels,
  };
}
