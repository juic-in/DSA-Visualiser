import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SortingVisualiser } from './components/SortingVisualiser/SortingVisualiser';
import { PathfindingVisualiser } from './components/PathfindingVisualiser/PathfindingVisualiser';
import { HomePage } from './components/HomePage/HomePage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sorting"
            element={<SortingVisualiser min={5} max={950} arraySize={250} />}
          />
          <Route
            path="/pathfinding"
            element={<PathfindingVisualiser maxRows={20} maxCols={50} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
