import { useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate form submission success
    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="nav w-full">
        <Header />
      </div>
      <div className="maincontact px-2 py-8 gap-2 w-full max-w-[1500px] flex flex-col md:flex-row justify-center items-center">
        <div className="first-content text-center sm:text-left flex flex-col gap-6 w-full lg:w-1/2">
          <div className="">
            <h1 className="text-3lx sm:text-7xl font-bold">
              Get in touch with us directly
            </h1>
            <br />
            <p>
              We're here to help you. Tell us how we can help & well be in touch
              with an expert within the next 24 hours.{" "}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <strong>send use email</strong>
            <p>info.example.com</p>
            {/* <p> info@socialinkia.com</p> */}
          </div>
          {/* <div className="flex flex-col gap-3">
            <strong>Give us a call</strong>
            <p>(123)456-7890</p>
          </div> */}
          <div className="flex flex-col gap-3">
            <strong>Follow us:</strong>
            <div className="social-links flex flex-row gap-2">
              <Link
                className="border-[2px] w-fit p-3 border-accent rounded-lg transition-all duration-1000 hover:rounded-full hover:bg-accent"
                to={"#"}
              >
                <Facebook />
              </Link>
              <Link
                className="border-[2px] w-fit p-3 border-accent rounded-lg transition-all duration-1000 hover:rounded-full hover:bg-accent"
                to={"#"}
              >
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="form-content px-2 flex flex-col gap-6 w-full lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            action="https://formsubmit.co/cuesitweb@hamham.uk"
            method="POST"
            className="rounded-lg flex flex-col gap-6 shadow-md bg-background w-full p-2"
          >
            <div className="w-full flex flex-col lg:flex-row gap-3">
              <div className="w-full flex flex-col gap-3 text-left justify-center">
                <label htmlFor="name" className="text-accent font-bold">
                  Enter your name
                </label>
                <input
                  onChange={handleChange}
                  required
                  value={formData.name}
                  className="p-4 rounded-lg border-neutral-700 font-bold text-neutral-700"
                  placeholder=" Enter your name "
                  type="text"
                  name="name"
                  id="name"
                />
              </div>
              <div className="w-full flex flex-col gap-3 text-left justify-center">
                <label htmlFor="email" className="text-accent font-bold">
                  Email address
                </label>
                <input
                  onChange={handleChange}
                  required
                  value={formData.email}
                  className="p-4 rounded-lg border-neutral-700 font-bold text-neutral-700"
                  placeholder="example@mail.com"
                  type="email"
                  name="email"
                  id="email"
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-3">
              <div className="w-full flex flex-col gap-3 text-left justify-center">
                <label htmlFor="phone" className="text-accent font-bold">
                  Phone number
                </label>
                <input
                  onChange={handleChange}
                  value={formData.phone}
                  className="p-4 rounded-lg border-neutral-700 font-bold text-neutral-700"
                  placeholder="Enter your email"
                  type="number"
                  name="phone"
                  id="phone"
                />
              </div>
              <div className="w-full flex flex-col gap-3 text-left justify-center">
                <label htmlFor="company" className="text-accent font-bold">
                  Company
                </label>
                <input
                  onChange={handleChange}
                  value={formData.company}
                  required
                  className="p-4 rounded-lg border-neutral-700 font-bold text-neutral-700"
                  placeholder="Enter your email"
                  type="text"
                  name="company"
                  id="company"
                />
              </div>
            </div>
            <div className="w-full text-left flex gap-3 flex-col justify-center">
              <label
                htmlFor="message"
                className="text-accent text-left font-bold"
              >
                Message
              </label>
              <textarea
                onChange={handleChange}
                value={formData.message}
                rows={6}
                required
                className="p-4 rounded-lg border-neutral-700 font-bold text-neutral-700 w-full"
                placeholder="Write your message here ..........."
                type="email"
                name="message"
                id="email"
              />
            </div>
            <div className="w-full">
              <button
                className="p-4 bg-black rounded-full text-white hover:bg-accent"
                type="submit"
              >
                Send your message
              </button>
            </div>
            {isSubmitted && (
              <div className="submitsucsess text-sm border-[2px] border-green-500 rounded-lg px-2">
                <p>Thank you for your message have been submitted</p>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="slide-holder w-full bg-black py-5 my-24">
        <div className="w-full text-3xl font-bold sm:text-8xl text-accent flex flex-row gap-9">
          <p>Socialinkia</p>
          <p>automatic</p>
          <p>community</p>
          <p>Socialinkia</p>
        </div>
      </div>
      <div className="footer w-full">
        <Footer />
      </div>
    </div>
  );
}
