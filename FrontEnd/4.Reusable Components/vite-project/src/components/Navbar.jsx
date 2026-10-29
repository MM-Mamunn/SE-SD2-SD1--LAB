import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="mb-4 flex gap-4 text-blue-500 underline">
      <Link to="/">Main</Link>
      <Link to="/group1/home">Home (Group 1)</Link>
      <Link to="/group1/about">About</Link>
      <Link to="/group2/dashboard">Dashboard</Link>
    </nav>
  );
}
