import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import "../css/switch.css";

export default function Pricingcard() {
  const [submood, setsubmood] = useState(false);
  const [isOn, setIsOn] = useState(true);

  function handlesubscriptionswitch() {
    setsubmood(!submood);
  }

  const toggleClass = () => {
    setIsOn(!isOn);
    handlesubscriptionswitch();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full">
        <div
          className={`container ${isOn ? "on" : "off"}`}
          onClick={toggleClass}
        >
          <div className="toggle text-center font-bold flex justify-center items-center">
            <h1>{isOn ? "Anually" : "Monthly"}</h1>
          </div>
        </div>
      </div>
      <div
        className={`w-full mt-10 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
          isOn ? "lg:grid-cols-4 " : ""
        }`}
      >
        {submood ? (
          <>
            <div className="w-full shadow-lg rounded-lg bg-background2 flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">BASIC</p>
              <br />
              <p>1 member</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$9,99</span> / month
              </p>
              <br />
              <p>
                Ideal for individuals and small businesses just getting started.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>

            <div className="w-full shadow-lg rounded-lg bg-background2 flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">ESSENCIAL</p>
              <br />
              <p>Up to 50 members</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$20</span> / month
              </p>
              <br />
              <p>
                This is an excellent option for a small businesses who are
                starting out.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>

            <div className="w-full shadow-lg rounded-lg bg-black text-white flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">PREMIUM</p>
              <br />
              <p>Up to 50 members</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$40</span> / month
              </p>
              <br />
              <p>
                This plan is suitable for e-commerce stores as well as
                professional blogs.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full hover:bg-background font-bold p-4 border-[2px] border-black bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full shadow-lg rounded-lg bg-background2 flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">Free</p>
              <br />
              <p>1 member</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$19</span> / month
              </p>
              <br />
              <p>
                Ideal for individuals and small businesses just getting started.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>
            <div className="w-full shadow-lg rounded-lg bg-background2 flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">Beginner</p>
              <br />
              <p>Up to 50 members</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$39</span> / month
              </p>
              <br />
              <p>
                This is an excellent option for a small businesses who are
                starting out.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>
            <div className="w-full shadow-lg rounded-lg bg-black text-white flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">Starter</p>
              <br />
              <p>Up to 50 members</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$79</span> / month
              </p>
              <br />
              <p>
                This plan is suitable for e-commerce stores as well as
                professional blogs.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full font-bold hover:bg-background p-4 border-[2px] border-black bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>
            <div className="w-full shadow-lg rounded-lg bg-background2 flex flex-col gap-4 p-3">
              <p className="font-bold text-2xl">Pro</p>
              <br />
              <p>Up to 100 members</p>
              <br />
              <p>
                <span className="text-6xl font-bold">$99</span> / month
              </p>
              <br />
              <p>
                Ideal for individuals and small businesses just getting started.
              </p>
              <ul>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck /> Ai-Ready Data Prep
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Feature Engineering
                </li>
                <li className="font-bold flex flex-row items-center gap-2">
                  <BadgeCheck />
                  Classification Models
                </li>
              </ul>
              <div className="w-full flex justify-center items-center">
                <button className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out">
                  Choose Plan
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
