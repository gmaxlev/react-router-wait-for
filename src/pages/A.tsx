import { Outlet, Link } from "react-router-dom";

export default function A() {
  return (
    <div className="page">
      <div className="route">A (/a)</div>
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
      <Outlet />
    </div>
  );
}
