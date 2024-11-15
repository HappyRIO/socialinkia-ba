import { BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/switch.css";

export default function Pricingcard() {
  const navigate = useNavigate();

  const BasicPlan = () => {
    const params = new URLSearchParams({ plan: "basic" });
    navigate(`/subscription/signup?${params.toString()}`);
  };

  const StandardPlan = () => {
    const params = new URLSearchParams({ plan: "standard" });
    navigate(`/subscription/signup?${params.toString()}`);
  };

  const PremiumPlan = () => {
    const params = new URLSearchParams({ plan: "premium" });
    navigate(`/subscription/signup?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full h-[80vh] flex flex-col justify-center items-center bg-[url('/images/hero-bg-2.png')] bg-cover bg-center bg-no-repeat text-white">
        <h1 className="w-full text-center text-3xl font-bold md:text-7xl">
          pick a plan that works best for you
        </h1>
        <p>no credit card required</p>
      </div>
      <div className="w-full py-10 max-w-[1000px] md:gap-4 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
            <button
              onClick={BasicPlan}
              className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out"
            >
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
            This is an excellent option for a small businesses who are starting
            out.
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
            <button
              onClick={StandardPlan}
              className="rounded-full font-bold p-4 border-[2px] border-black hover:bg-accent transition-all duration-1000 ease-in-out"
            >
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
            This plan is suitable for e-commerce stores as well as professional
            blogs.
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
            <button
              onClick={PremiumPlan}
              className="rounded-full hover:bg-background font-bold p-4 border-[2px] border-black bg-accent transition-all duration-1000 ease-in-out"
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
