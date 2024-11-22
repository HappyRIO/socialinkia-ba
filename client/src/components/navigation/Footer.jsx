import { Link } from "react-router-dom";
import Newsletter from "../fragments/Newletter";

export default function Footer() {
  //border-t-[2px] border-t-gray-300
  return (
    <footer className="w-full px-2 bg-cover text-white bg-no-repeat bg-[url('/images/footer.png')] flex flex-col justify-center items-center">
      <div className="w-full py-36 max-w-[1500px] grid grid-cols-1 md:grid-cols-2 border-b-[2px] border-b-gray-300">
        <div className="logo-info flex flex-col gap-3 py-3">
          <img className="max-w-[300px]" src="/images/nav.png" alt="" />
          <div className="content-zone max-w-[500px]">
            <p>
              Plan, program and publish engaging publications effortlessly with
              our AI-driven platform.
            </p>
          </div>
        </div>
        <div className="links-signup flex flex-col md:flex-row w-full justify-between items-center">
          <div className="links-zone">
            <div className="link-head">
              <p className="font-bold text-2xl">Pages</p>
            </div>
            <div className="nav-link flex flex-col gap-2">
              <Link to={"/about"} className="text-white hover:underline">
                About
              </Link>
              <Link to={"/subscription"} className="text-white hover:underline">
                Pricing
              </Link>
              <Link to={"/contact"} className="text-white hover:underline">
                Contact
              </Link>
            </div>
          </div>
          <div className="newslwtter w-full flex flex-col gap-2 justify-center items-center">
            <Newsletter />
          </div>
        </div>
      </div>
      <div className="mainfeet py-10 text-center w-full px-2">
        <p>© {new Date().getFullYear()} All Rights Reserved by Socialinkia</p>
      </div>
    </footer>
  );
}
