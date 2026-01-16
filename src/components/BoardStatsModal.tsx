import { motion } from "framer-motion";
import { useBoardStats } from "../hooks/useBoardStats";

type BoardStatsModalProps = {
  onClose: () => void;
};

export function BoardStatsModal({ onClose }: BoardStatsModalProps) {
  const { totalCards, completedCards, overdueCards, busiestList } =
    useBoardStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-retro-ink/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-xl border-4 border-retro-ink bg-retro-paper p-6 shadow-retroPanel"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-retroHeading text-2xl font-black uppercase text-retro-ink">
            Estatísticas do Board
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-retro-ink hover:bg-retro-ink/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between rounded-lg border-2 border-retro-ink bg-retro-blue p-4 shadow-[2px_2px_0_rgba(0,0,0,1)]">
            <span className="font-retroHeading text-lg font-bold uppercase text-retro-ink">
              Total de Cards
            </span>
            <span className="font-retroHeading text-3xl font-black text-retro-ink">
              {totalCards}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border-2 border-retro-ink bg-retro-green p-4 shadow-[2px_2px_0_rgba(0,0,0,1)]">
            <span className="font-retroHeading text-lg font-bold uppercase text-retro-ink">
              Concluídos
            </span>
            <span className="font-retroHeading text-3xl font-black text-retro-ink">
              {completedCards}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border-2 border-retro-ink bg-retro-red p-4 shadow-[2px_2px_0_rgba(0,0,0,1)]">
            <span className="font-retroHeading text-lg font-bold uppercase text-retro-ink">
              Atrasados
            </span>
            <span className="font-retroHeading text-3xl font-black text-retro-ink">
              {overdueCards}
            </span>
          </div>

          <div className="rounded-lg border-2 border-retro-ink bg-retro-yellow p-4 shadow-[2px_2px_0_rgba(0,0,0,1)]">
            <div className="mb-1 font-retroHeading text-lg font-bold uppercase text-retro-ink">
              Lista Mais Movimentada
            </div>
            <div className="flex items-center justify-between">
              <span className="truncate font-retroBody font-bold text-retro-ink/80">
                {busiestList.title}
              </span>
              <span className="ml-2 whitespace-nowrap rounded bg-retro-ink px-2 py-0.5 font-retroBody text-xs font-bold text-retro-paper">
                {busiestList.count} cards
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
