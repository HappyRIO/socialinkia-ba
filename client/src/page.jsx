import { Link } from "react-router-dom";
import Footer from "./components/navigation/Footer";
import Header from "./components/navigation/Header";
import {
  ArrowRight,
  Banknote,
  Bot,
  Fullscreen,
  Languages,
  MessageSquareHeart,
  ScrollText,
} from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full bg-[url('/images/hero-bg-2.png')] flex flex-col justify-center items-center">
        <Header />
        <div className="hero-section w-full max-w-[1300px] flex flex-col justify-center items-center md:flex-row md:px-2">
          <div className="text-content text-white w-full md:1/2">
            <div className="txt-zone py-7 max-w-[600px]">
              <h1 className="text-4xl sm:text-6xl md:text-8xl">
                Automating your social networks effortlessly
              </h1>
              <br />
              <p>
                Plan, program and publish engaging publications effortlessly
                with our AI-driven platform.
              </p>
            </div>
            <div className="btn-zone gap-4 flex justify-between items-center">
              <Link to={"/signup"}>
                <button className="p-4 bg-accent rounded-full flex flex-row animate-pulse">
                  Free trial <ArrowRight />
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="p-4 bg-accent rounded-full flex flex-row animate-pulse">
                  See how it works <ArrowRight />
                </button>
              </Link>
            </div>
          </div>
          <div className="hero-image py-2 w-full md:1/2">
            <img
              className="w-full max-w-[500px]"
              src="/images/hero.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1000px] px-2 py-5 flex flex-col justify-center items-center">
        <div className="section-title text-3xl sm:text-5xl md:text-7xl text-center">
          <h1>Everything you need to automate your social networks</h1>
        </div>
      </div>
      <div className="w-full flex flex-col gap-6 py-10 justify-center items-center max-w-[1200px]">
        <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="every-card py-10 w-full flex flex-row gap-2">
            <div className="icon-zone scale-[1.2] text-accent aspect-square bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <MessageSquareHeart />
            </div>
            <div className="content-zone">
              <h1 className="text-3xl">Automatic publication</h1>
              <p>Schedule effortless posts for Facebook and Instagram.</p>
            </div>
          </div>
          <div className="every-card py-10 w-full flex flex-row gap-2">
            <div className="icon-zone scale-[1.2] text-accent aspect-square bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <Fullscreen />
            </div>
            <div className="content-zone">
              <h1 className="text-3xl">Customizable templates</h1>
              <p>Choose from several templates to match your brand.</p>
            </div>
          </div>
          <div className="every-card py-10 w-full flex flex-row gap-2">
            <div className="icon-zone scale-[1.2] text-accent aspect-square bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <Bot />
            </div>
            <div className="content-zone">
              <h1 className="text-3xl">Creativity of AI</h1>
              <p>Generate ideas with AI-driven content.</p>
            </div>
          </div>
        </div>
        <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="every-card py-10 w-full flex flex-row gap-2">
            <div className="icon-zone scale-[1.2] text-accent aspect-square bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <ScrollText />
            </div>
            <div className="content-zone">
              <h1 className="text-3xl">Publications in carousel</h1>
              <p>It creates attractive posts with multiple images.</p>
            </div>
          </div>
          <div className="every-card py-10 w-full flex flex-row gap-2">
            <div className="icon-zone scale-[1.2] text-accent aspect-square bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <Languages />
            </div>
            <div className="content-zone">
              <h1 className="text-3xl">Multilingual support</h1>
              <p>It supports English, Spanish, French and German.</p>
            </div>
          </div>
          <div className="every-card py-10 w-full flex flex-row gap-2">
            <div className="icon-zone scale-[1.2] text-accent aspect-square bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <Banknote />
            </div>
            <div className="content-zone">
              <h1 className="text-3xl">Flexible subscription plans</h1>
              <p>Try a 5-day free trial and explore the plans.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
