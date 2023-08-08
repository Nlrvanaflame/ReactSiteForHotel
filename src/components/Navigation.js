import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/"> Home</Link>
        </li>

        <li>
          <Link to="/electrical-equipment">Electrical Equipment</Link>
        </li>
        <li>
          <Link to="/furniture">Furniture</Link>
        </li>
        <li>
          <Link to="/rooms">Rooms</Link>
        </li>
        <li>
          <Link to="/apartments">Apartments</Link>
        </li>
        <li>
          <Link to="/floors">Floors</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
