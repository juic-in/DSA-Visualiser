import { Link } from 'react-router-dom';
import './AlgorithmHeader.css';

interface Props {
  currentAlgorithm: string;
}

export const AlgorithmHeader = ({ currentAlgorithm }: Props) => {
  return (
    <div className="algorithm-header">
      <p className="algorithm-header-text">
        Current Algorithm: {currentAlgorithm}
      </p>
      <Link to={'/'}>
        <button className="home-button">Home</button>
      </Link>
    </div>
  );
};
