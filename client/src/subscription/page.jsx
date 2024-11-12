import Pricingcard from "../components/fragments/Pricingcards";
import Footer from "../components/navigation/Footer";
import Header from "../components/navigation/Header";

export default function Subscription() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Header />
      <div className="w-full py-10 max-w-[700px] text-center text-3xl sm:5xl md:text-7xl font-bold">
        <h1>Find a flexible plan that suits your business</h1>
      </div>
      <div className="w-full flex justify-center items-center px-2">
        <Pricingcard />
      </div>
      <div className="slide-holder w-full bg-black py-5 my-24">
        <div className="w-full text-3xl font-bold sm:text-8xl text-accent flex flex-row gap-9">
          <p>Socialinkia</p>
          <p>automatic</p>
          <p>community</p>
          <p>Socialinkia</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
