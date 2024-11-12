import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-cover text-white bg-no-repeat bg-[url('/images/footer.png')] flex flex-col justify-center items-center">
      <div className="w-full py-36 max-w-[1100px] grid grid-cols-1 md:grid-cols-2 border-t-[2px] border-t-gray-300 border-b-[2px] border-b-gray-300">
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
            <div className="relative mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                aria-label="Email address"
                className="block w-full rounded-2xl border border-accent bg-transparent py-4 pl-6 pr-20 text-base/6 text-white ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
              />
              <div className="absolute inset-y-1 right-1 flex justify-end">
                <button
                  type="submit"
                  aria-label="Submit"
                  className="flex aspect-square h-full items-center justify-center rounded-xl bg-accent text-white transition hover:bg-secondary"
                >
                  <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="submitsucsess border-[2px] border-green-500 rounded-lg px-2">
              <p>Thank you for your message. It has been sent.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mainfeet py-10 text-center w-full px-2">
        <p>© {new Date().getFullYear()} All Rights Reserved by Socialinkia</p>
      </div>
    </footer>
  );
}
