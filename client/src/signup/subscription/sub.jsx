import Pricingcard from "../../components/fragments/Pricingcards";
import Header from "../../components/navigation/Header";
import Footer from "../../components/navigation/Footer";

export default function Subscrptionmain() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="header-section w-full flex flex-col justify-center items-center">
        <Header />
      </div>
      <Pricingcard />
      <div className="footer-secton w-full flex flex-col justify-center items-center">
        <Footer />
      </div>
    </div>
  );
}
