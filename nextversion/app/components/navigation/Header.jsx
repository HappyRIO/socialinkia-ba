"use client";
import { PanelTopClose, PanelTopOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleopenmenu() {
    setMenuOpen(!menuOpen);
  }
  useEffect(() => {});
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-accent shadow-md">
      <div className="text-2xl font-bold text-white">
        <Link to={"/"}>Socialinkia</Link>
      </div>
      <div className="menutbn sm:hidden text-white">
        <button onClick={handleopenmenu}>
          {menuOpen ? <PanelTopClose /> : <PanelTopOpen />}
        </button>
      </div>
      <div id="desktop-nave" className="desk hidden sm:block">
        <nav className="md:flex space-x-6">
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
      </div>
      {menuOpen && (
        <div
          id="mobile-nav"
          className="mobile-nav shadow-lg py-2 px-2 mt-[4rem] bg-accent sm:hidden absolute top-0 left-0 w-full"
        >
          <nav className="flex flex-col gap-2 justify-center items-center">
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
        </div>
      )}
    </header>
  );
}
