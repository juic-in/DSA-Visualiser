import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SortingVisualiser } from './components/SortingVisualiser/SortingVisualiser';
import { PathfindingVisualiser } from './components/PathfindingVisualiser/PathfindingVisualiser';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/sorting"
            element={<SortingVisualiser min={5} max={1000} arraySize={250} />}
          />
          <Route
            path="/pathfinding"
            element={<PathfindingVisualiser maxRows={20} maxCols={50}/>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
