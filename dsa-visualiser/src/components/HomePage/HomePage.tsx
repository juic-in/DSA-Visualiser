import { Link } from 'react-router-dom';
import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="visualiser-redirects">
      <h1 className="title">DSA Visualizer</h1>
      <div className="button-group">
        <Link to="/sorting">
          <button className="redirect-button redirect-sorting">Sorting Visualizer</button>
        </Link>
        <Link to="/pathfinding">
          <button className="redirect-button redirect-pathfinding">Pathfinding Visualizer</button>
        </Link>
      </div>
    </div>
  );
};
