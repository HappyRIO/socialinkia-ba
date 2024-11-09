"use client";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "next/link";
// import Whatsicon from "@/components/fragments/Whatsicon";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import FAQSection from "../components/fragments/Faqsection";

export default function Contact() {
  const Whatsicon = "W";
  const [formData, setFormData] = useState({
    name: "",
    socialLink: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [working, setworking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setworking(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/contact/send-contact-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email.");
      }

      const data = await response.json();
      setSuccess(data.message);
      setworking(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="nav w-full">
        <Header />
      </div>
      <div className="maincontact py-2 gap-2 w-full flex flex-col justify-center items-center">
        <div className="banner text-center py-3 sm:py-6 w-full border-b-[2px] border-accent justify-center items-center">
          <h1 className="text-3xl sm:text-6xl font-bold">Contact Us</h1>
          <p>
            Get in touch to discover how we can elevate your Airbnb experience
            and make your events unforgettable.
          </p>
        </div>
        <div className="contactform px-2 gap-2 w-full flex flex-col md:flex-row justify-center items-center">
          <div className="mainform w-full md:w-1/2">
            <form
              className="w-full gap-2 grid grid-cols-1"
              onSubmit={handleSubmit}
            >
              <input
                required
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="w-full bg-background focus:border-secondary border-[1px] border-accent rounded-lg p-2 outline-none"
              />
              <input
                required
                type="text"
                name="socialLink"
                placeholder="WhatsApp number or any social link (e.g. Instagram)"
                onChange={handleChange}
                className="w-full bg-background focus:border-secondary border-[1px] border-accent rounded-lg p-2 outline-none"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full bg-background focus:border-secondary border-[1px] border-accent rounded-lg p-2 outline-none"
              />
              <textarea
                required
                name="message"
                placeholder="Message"
                rows={5}
                onChange={handleChange}
                className="w-full bg-background focus:border-secondary border-[1px] border-accent rounded-lg p-2 outline-none"
              />
              <button
                type="submit"
                className="w-full border-[1px] border-accent hover:border-secondary rounded-lg p-2 outline-none"
              >
                {working ? <>Submiting</> : <>Submit</>}
              </button>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </form>
          </div>
          <div className="extracontent flex flex-col justify-center w-full md:w-1/2">
            <div className="minitext">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
                quam explicabo quos quibusdam officiis eos assumenda numquam
                praesentium repudiandae saepe! Perspiciatis voluptatibus maiores
                autem quam rerum illo molestiae vitae laborum.
              </p>
            </div>
            <div className="iconswork grid gap-2 grid-cols-2">
              <div className="teliphone flex flex-col justify-center items-center">
                <Link href="tel:+2349012157888">
                  <Phone />
                </Link>
                <p className="font-bold">Phone Number</p>
                <p className="text-sm">45678921e32</p>
              </div>
              <div className="teliphone flex flex-col justify-center items-center">
                <Link href="mailto:iamperfect0518@gmail.com">
                  <Mail />
                </Link>
                <p className="font-bold">Email Address</p>
                <p className="text-sm">youremail@provider.com</p>
              </div>
              <div className="whatsapp flex flex-col justify-center items-center">
                <Link
                  href="https://wa.me/234567887654"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Whatsicon}
                </Link>
                <p className="font-bold">WhatsApp Number</p>
                <p className="text-sm">2546789392</p>
              </div>
              <div className="teliphone flex flex-col justify-center items-center">
                <MapPin />
                <p className="font-bold">Our Office</p>
                <p className="text-sm">I don't know</p>
              </div>
            </div>
          </div>
        </div>
        <div className="simpletxt text-center py-4 text-2xl font-bold md:text-4xl">
          <h1>We are always ready to help</h1>
        </div>
      </div>
      <div className="faq w-full">
        <FAQSection />
      </div>
      <div className="footer w-full">
        <Footer />
      </div>
    </div>
  );
}
