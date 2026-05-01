import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans">
      <Nav />
      <Outlet />
    </div>
  );
}
