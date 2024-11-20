import { Link } from "react-router-dom";
import Footer from "./components/navigation/Footer";
import Header from "./components/navigation/Header";
import {
  ArrowRight,
  Banknote,
  Bot,
  CircleDot,
  Fullscreen,
  Languages,
  MessageSquareHeart,
  ScrollText,
} from "lucide-react";
import "./assets/css/scrollingcss.css";
import FAQSection from "./components/fragments/Faqsection";
import Newsletter from "./components/fragments/Newletter";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full bg-[url('/images/hero-bg-2.png')] bg-cover bg-no-repeat flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <Header />
          <div className="hero-section w-full max-w-[1500px] flex flex-col justify-center items-center md:flex-row md:px-2 py-9">
            <div className="text-content text-white w-full md:1/2">
              <div className="txt-zone py-7 max-w-[600px] px-2 md:px-0">
                <h1 className="text-4xl md:text-7xl">
                  Automating your social networks effortlessly
                </h1>
                <br />
                <p>
                  Plan, program and publish engaging publications effortlessly
                  with our AI-driven platform.
                </p>
              </div>
              <div className="btn-zone gap-4 flex justify-between items-center px-2">
                <Link to={"/subscription"}>
                  <button className="p-4 bg-accent rounded-full flex flex-row items-center animate-pulse">
                    Free trial <ArrowRight />
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="p-4 bg-accent rounded-full flex flex-row items-center animate-pulse">
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
      </div>
      <div className="w-full max-w-[800px] px-2 py-5 flex flex-col justify-center items-center">
        <div className="section-title text-3xl sm:text-5xl md:text-7xl text-center">
          <h1>Everything you need to automate your social networks</h1>
        </div>
      </div>
      <div className="w-full flex flex-col gap-6 py-10 justify-center items-center max-w-[1500px]">
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
      <div className="w-full flex flex-col md:flex-row gap-6 py-10 justify-center items-center max-w-[1500px]">
        <div className="image-zone w-full md:1/2">
          <img src="/images/mobile.png" alt="" />
        </div>
        <div className="text-zone-content flex flex-col gap-4 w-full md:1/2 px-3">
          <div>
            <h1 className="text-4xl sm:text-7xl text-center">
              How does it work?
            </h1>
            <br />
            <p>
              Our AI system stands out for understanding natural language and
              generating similar responses to human ones. Adapting your
              conversational style to our chatbot can improve the quality of
              your interactions.
            </p>
          </div>
          <div className="w-full">
            <ul className="text-2xl text-text font-medium">
              <li className="flex flex-row gap-2 items-center">
                <span className="text-accent">
                  <CircleDot />
                </span>
                {""}
                Register and customize
              </li>
              <li className="flex flex-row gap-2 items-center">
                <span className="text-accent">
                  <CircleDot />
                </span>
                {""} Plan your publications
              </li>
              <li className="flex flex-row gap-2 items-center">
                <span className="text-accent">
                  <CircleDot />
                </span>
                {""} Let AI do the job
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full bg-[url('/images/hero-bg-2.png')] bg-cover bg-no-repeat py-10 text-white flex justify-center items-center">
        <div className="w-full flex flex-col-reverse md:flex-row gap-6 py-10 justify-center items-center max-w-[1500px]">
          <div className="text-zone-content flex flex-col gap-4 w-full md:1/2 px-3">
            <div>
              <h1 className="text-4xl sm:text-7xl text-center">
                Integrate your social networks
              </h1>
              <br />
              <p>
                You can now have automatic content for your social networks.
              </p>
            </div>
            <div className="w-full">
              <ul className="text-2xl font-medium flex flex-col gap-2">
                <li className="flex flex-row gap-2 justify-start items-center h-fit">
                  <span className="text-accent">
                    <CircleDot />
                  </span>
                  {""}
                  Manage your Facebook and Instagram
                </li>
                <li className="flex flex-row gap-2 justify-start items-center h-fit">
                  <span className="text-accent">
                    <CircleDot />
                  </span>
                  {""} AI will publish content for you
                </li>
                <li className="flex flex-row gap-2 justify-start items-center h-fit">
                  <span className="text-accent">
                    <CircleDot />
                  </span>
                  {""} Optimize your social networks and increase your goals
                </li>
              </ul>
            </div>
            <div className="btn-zone py-4">
              <Link to={"/subscription"}>
                <button className="p-4 bg-accent rounded-full flex flex-row items-center animate-pulse">
                  Free trial <ArrowRight />
                </button>
              </Link>
            </div>
          </div>
          <div className="image-zone w-full md:w-1/2 rounded-lg px-2">
            <div className="w-full py-36 bg-[#18181b] rounded-lg gap-8 flex flex-col overflow-hidden">
              {/* First Row (Scroll Left) */}
              <div
                className="svgs-zone flex gap-20 animate-scroll-left"
                style={{ animation: "scroll-left 20s linear infinite" }}
              >
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/whatsapp.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/slack.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/facebook.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/skype.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px] bg-yellow-400"
                  src="/svgs/mailchip.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/snapchat.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/discord2.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/whatsapp.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/slack.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/facebook.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/skype.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px] bg-yellow-400"
                  src="/svgs/mailchip.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/snapchat.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/discord2.svg"
                  alt=""
                />
              </div>

              {/* Second Row (Scroll Right) */}
              <div
                className="svgs-zone flex gap-20 animate-scroll-right"
                style={{ animation: "scroll-right 20s linear infinite" }}
              >
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/facebook.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/slack.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/whatsapp.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/snapchat.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px] bg-yellow-400"
                  src="/svgs/mailchip.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/discord2.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/skype.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/facebook.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/slack.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/whatsapp.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/snapchat.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px] bg-yellow-400"
                  src="/svgs/mailchip.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/discord2.svg"
                  alt=""
                />
                <img
                  className="aspect-square scale-[0.6] sm:scale-[0.8] md:scale-[1] rounded-lg w-[100px] h-[100px]"
                  src="/svgs/skype.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="faq-zone">
        <FAQSection />
      </div>
      <footer className="text-white pt-32 bg-[url('/images/footer.png')] bg-cover bg-no-repeat w-full flex flex-col justify-center items-center px-2">
        <div className="top-foot-zone flex flex-col justify-center items-center gap-10 max-w-[1000px]">
          <p className="text-3xl sm:text-6xl text-center">
            Let's start and enjoy the power of AI
          </p>
          <br />
          <div className="w-full flex justify-center items-center">
            <Newsletter />
          </div>
        </div>
        <div className="foot-foot flex flex-col py-10 md:flex-row justify-between items-center max-w-[1500px]">
          <img className="max-w-[300px]" src="/images/nav.png" alt="" />
          <p>Copyright 2024, All Rights Reserved by Socialinkia.com</p>
        </div>
      </footer>
    </div>
  );
}
