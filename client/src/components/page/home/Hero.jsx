import React from "react";
import { Link } from "react-router-dom";
import Toaster from "../../fragments/Toast";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-accent shadow-md">
        <div className="text-2xl font-bold text-white">Socialinkia</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-white hover:underline">Home</a>
          <a href="#" className="text-white hover:underline">Features</a>
          <a href="#" className="text-white hover:underline">Pricing</a>
          <a href="#" className="text-white hover:underline">About</a>
          <a href="#" className="text-white hover:underline">Contact</a>
          <a href="#" className="text-white hover:underline">Login/Signup</a>
        </nav>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Key Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Everything You Need to Automate Your Social Media</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Automatic Publishing" description="Schedule posts effortlessly for Facebook and Instagram." />
            <FeatureCard title="Customizable Templates" description="Choose from various templates to match your brand." />
            <FeatureCard title="Carousel Posts" description="Create engaging multi-image posts." />
            <FeatureCard title="AI Creativity" description="Generate ideas with AI-driven content." />
            <FeatureCard title="Multilingual Support" description="Supports English, Spanish, French, and German." />
            <FeatureCard title="Flexible Subscription Plans" description="Try a 5-day free trial and explore plans." />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="flex flex-col lg:flex-row lg:justify-around">
            <HowItWorksStep step="1" title="Sign Up & Customize" description="Enter company details and select templates." />
            <HowItWorksStep step="2" title="Schedule & Preview" description="Plan your posts and view previews." />
            <HowItWorksStep step="3" title="Let AI Do the Work" description="AI generates posts optimized for social." />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Affordable Plans for Every Business</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard plan="Starter" posts="10" price="$9.99" />
            <PricingCard plan="Professional" posts="30" price="$19.99" />
            <PricingCard plan="Enterprise" posts="Unlimited" price="$49.99" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-white">
        <div className="container mx-auto text-center space-y-4">
          <p>© {new Date().getFullYear()} Socialinkia. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-gray-200 text-center py-20 px-6">
      <Toaster type={"success"} message={"kings test for honor"} />
      <h1 className="text-4xl font-bold text-accent mb-4">Effortless Social Media Automation for Facebook and Instagram</h1>
      <p className="text-lg mb-6">Plan, schedule, and publish engaging posts effortlessly with our AI-powered platform.</p>
      <div className="space-x-4">
        <Link to="/signup">
          <button className="bg-accent hover:bg-primary text-white rounded-lg px-6 py-2">Start Free Trial</button>
        </Link>
        <Link to="/how-it-works">
          <button className="bg-primary hover:bg-accent text-white rounded-lg px-6 py-2">See How it Works</button>
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

function HowItWorksStep({ step, title, description }) {
  return (
    <div className="lg:w-1/3 mb-6 lg:mb-0 px-6">
      <div className="bg-accent text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto text-lg font-bold">{step}</div>
      <h3 className="text-xl font-semibold my-4">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function PricingCard({ plan, posts, price }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-2xl font-semibold mb-2">{plan}</h3>
      <p className="text-gray-500 mb-4">{posts} Posts/month</p>
      <p className="text-3xl font-bold mb-4">{price}</p>
      <button className="bg-primary hover:bg-accent text-white rounded-lg px-6 py-2">Choose Plan</button>
    </div>
  );
}
