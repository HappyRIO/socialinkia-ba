import Pricingcard from "../components/fragments/Pricingcards";
import Footer from "../components/navigation/Footer";
import Header from "../components/navigation/Header";

export default function Subscription() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <Pricingcard />
      <Footer />
    </div>
  );
}
