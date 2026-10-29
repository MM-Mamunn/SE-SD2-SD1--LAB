import { Link } from 'react-router-dom';

export default function Navbar(props) {
  return (
    <nav className="mb-4 flex gap-4 text-blue-500 ">
      <Link to="/">Main</Link>
      <Link to="/group1/home">Home</Link>
      <Link to="/group1/about">About</Link>
      <Link to="/group2/dashboard">Dashboard</Link>
      <Link to="/usestate">Hooks</Link>
      <button className = "ml-[500px]  text-green-500">{props.name}|{props.age}</button>
    </nav>
    
  );
}
