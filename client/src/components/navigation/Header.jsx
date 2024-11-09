import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-accent shadow-md">
      <div className="text-2xl font-bold text-white">
        <Link to={"/"}>Socialinkia</Link>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link to={"/#"} className="text-white hover:underline">
          Home
        </Link>
        <Link to={"/#Features"} className="text-white hover:underline">
          Features
        </Link>
        <Link to={"/#Pricing"} className="text-white hover:underline">
          Pricing
        </Link>
        {/* <Link to={"#"} className="text-white hover:underline">
          About
        </Link> */}
        <Link to={"/contact"} className="text-white hover:underline">
          Contact
        </Link>
        <Link to={"/login"} className="text-white hover:underline">
          Login/Signup
        </Link>
      </nav>
    </header>
  );
}
