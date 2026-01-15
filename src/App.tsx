import { Board } from "./components/Board";
import { initialBoard } from "./data/initial-data";

function App() {
  return <Board {...initialBoard} />;
}

export default App;
