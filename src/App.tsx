import { Board } from "./components/Board";
import { BoardProvider } from "./contexts/BoardContext";
import { initialBoard } from "./data/initial-data";

function App() {
  return (
    <div className="min-h-screen bg-retro-blue bg-[radial-gradient(circle_at_24px_24px,#ffffff40_2px,transparent_0)] [background-size:32px_32px] text-retro-ink">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
        <div className="relative w-full max-w-6xl rounded-[40px] border-[5px] border-retro-ink bg-retro-paper/95 px-6 pb-10 pt-10 shadow-retroPanel outline outline-[3px] outline-white/80 -outline-offset-4">
          <BoardProvider initialBoard={initialBoard}>
            <Board />
          </BoardProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
