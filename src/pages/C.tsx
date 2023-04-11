import { Link } from "react-router-dom";

export default function C() {
  return (
    <div className="page">
      <div className="route">C (/a/b/c)</div>
      <Link to="/" className="link">
        /
      </Link>
      <Link to="/a" className="link">
        /a
      </Link>
      <Link to="/a/b" className="link">
        /a/b
      </Link>
      <Link to="/a/b/c" className="link">
        /a/b/c
      </Link>
    </div>
  );
}
