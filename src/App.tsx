import { Board } from "./components/Board";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initialBoard } from "./data/initial-data";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <Board {...initialBoard} />
      </div>
    </ThemeProvider>
  );
}

export default App;
