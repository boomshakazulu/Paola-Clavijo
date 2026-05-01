import { NavLink } from "react-router-dom";

export default function Nav() {
  const linkClass = ({ isActive }) =>
    [
      "no-underline transition-opacity duration-200",
      isActive ? "opacity-100" : "opacity-75 hover:opacity-100",
    ].join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-start justify-center gap-3 px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] sm:items-center sm:px-7 sm:py-4">
      {/* <NavLink to="/" className="no-underline">
        Paola Clavijo
      </NavLink> */}
      <nav
        className="flex flex-wrap gap-3 sm:gap-5 text-base"
        aria-label="Main Navigation"
      >
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/work" className={linkClass}>
          Work
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
}
