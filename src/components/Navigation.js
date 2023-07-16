import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        
        <li>
          <Link to="/electrical-equipment">Electrical Equipment</Link>
        </li>
        <li>
          <Link to="/furniture">Furniture</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
