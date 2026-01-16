import { useMemo } from "react";
import { useBoard } from "../contexts/BoardContext";

export function useBoardStats() {
  const { board } = useBoard();

  const stats = useMemo(() => {
    let totalCards = 0;
    let completedCards = 0;
    let overdueCards = 0;
    let busiestList = { title: "Nenhuma", count: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only

    board.lists.forEach((list, index) => {
      const listCardCount = list.cards.length;
      totalCards += listCardCount;

      // Check for busiest list
      if (listCardCount > busiestList.count) {
        busiestList = { title: list.title, count: listCardCount };
      }

      // Check if it's the last list (Completed)
      // Assuming the last list is the "Done" list for simplicity in this MVP
      const isCompletedList = index === board.lists.length - 1;

      list.cards.forEach((card) => {
        if (isCompletedList) {
          completedCards++;
        }

        // Check for overdue cards
        // Only count as overdue if NOT in the completed list
        if (!isCompletedList && card.dueDate) {
          const cardDate = new Date(card.dueDate);
          cardDate.setHours(0, 0, 0, 0);

          if (cardDate < today) {
            overdueCards++;
          }
        }
      });
    });

    return {
      totalCards,
      completedCards,
      overdueCards,
      busiestList,
    };
  }, [board.lists]);

  return stats;
}
