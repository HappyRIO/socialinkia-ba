import { Logs, AlignJustify } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleopenmenu() {
    setMenuOpen(!menuOpen);
  }
  useEffect(() => {});
  return (
    <header className="w-full z-10 flex justify-between items-center px-6 py-4 bg-black shadow-md">
      <div className="text-2xl font-bold text-white">
        <Link to={"/"}>
          <img
            className="max-w-[300px]"
            src="/images/nav.png"
            alt="logo of the website"
          />
        </Link>
      </div>
      <div className="menutbn md:hidden text-white">
        <button onClick={handleopenmenu}>
          {menuOpen ? <Logs /> : <AlignJustify />}
        </button>
      </div>
      <div
        id="desktop-nave"
        className="desk hidden md:flex w-3/5 flex-row justify-between items-center"
      >
        <nav className="md:flex space-x-6">
          <Link to={"/#"} className="text-white font-bold hover:underline">
            Home
          </Link>
          <Link to={"/about"} className="text-white font-bold hover:underline">
            About
          </Link>
          <Link
            to={"/subscription"}
            className="text-white font-bold hover:underline"
          >
            Pricing
          </Link>
          <Link
            to={"/contact"}
            className="text-white font-bold hover:underline"
          >
            Contact
          </Link>
        </nav>
        <div className="w-fit flex gap-2 justify-center items-center">
          <Link to={"/login"} className="text-white font-bold hover:underline">
            Login
          </Link>
          <Link
            to={"/subscription"}
            className="text-white bg-accent px-6 p-2 rounded-full animate-pulse font-bold hover:underline"
          >
            free trial
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div
          id="mobile-nav"
          className="mobile-nav h-screen py-2 px-2 bg-accent md:hidden absolute top-0 right-0 w-full sm:w-3/4 shadow-lg"
        >
          <nav className="flex flex-col gap-2 justify-center items-center">
            <div className="logohead py-6 flex flex-row justify-between items-center w-full px-2">
              <Link to={"/"}>
                <img
                  className="w-[200px]"
                  src="/images/nav.png"
                  alt="logo of business"
                />
              </Link>
              <div className="menutbn md:hidden text-white">
                <button onClick={handleopenmenu}>
                  {menuOpen ? <Logs /> : <AlignJustify />}
                </button>
              </div>
            </div>
            <Link
              to={"/#"}
              className="text-white py-3 border-b-[2px] w-full px-3 font-bold hover:underline"
            >
              Home
            </Link>
            <Link
              to={"/about"}
              className="text-white font-bold py-3 border-b-[2px] w-full px-3 hover:underline"
            >
              About
            </Link>
            <Link
              to={"/subscription"}
              className="text-white font-bold py-3 border-b-[2px] w-full px-3 hover:underline"
            >
              Pricing
            </Link>
            <Link
              to={"/contact"}
              className="text-white font-bold py-3 border-b-[2px] w-full px-3 hover:underline"
            >
              Contact
            </Link>
            <div className="w-fit flex gap-2 justify-center items-center">
              <Link
                to={"/login"}
                className="text-white font-bold hover:underline"
              >
                Login
              </Link>
              <Link
                to={"/subscription"}
                className="text-black bg-background px-6 p-2 rounded-full animate-pulse font-bold hover:underline"
              >
                free trial
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
