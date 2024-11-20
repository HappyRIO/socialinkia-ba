import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../../components/navigation/Header";
import Footer from "../../../components/navigation/Footer";

export default function SignupMain() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    subscription: `${plan}`,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", // Send cookies with the request
        }
      );

      if (response.ok) {
        // Successful registration, proceed to the next signup step
        navigate("/subscription/signup/details"); // Use navigate for internal routing
      } else {
        const data = await response.json();

        if (data.error === "Email already exists.") {
          // Redirect to login page if email already exists
          alert("Email already exists. Redirecting to login...");
          navigate("/login");
        } else {
          // Show a general error alert for other cases
          alert("Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    console.log({ eventmanager: "loaded" });
    // In the parent window (opener window)
    window.addEventListener("message", (event) => {
      // Make sure the message is coming from a trusted source
      if (event.origin !== import.meta.env.VITE_SERVER_BASE_URL) {
        console.warn("Message received from untrusted origin:", event.origin);
        return;
      }

      // Check for the expected data in the message
      if (event.data && event.data.redirectUrl) {
        const redirectUrl = event.data.redirectUrl;
        console.log("Redirect URL received:", redirectUrl);

        // Redirect the parent window to the received URL
        window.location.href = redirectUrl;
      }
    });
  }, []);

  const googlesignup = () => {
    const backendUrl = `${
      import.meta.env.VITE_SERVER_BASE_URL
    }/api/google/auth/google/signup?plan=${plan}`;
    const authWindow = window.open(
      backendUrl,
      "_blank",
      "width=500,height=600"
    );
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="nav w-full">
        <Header />
      </div>
      <div className="icon pt-[50px] w-fit min-w-[200px] h-fit">
        <img src="/icons/signup.svg" alt="signup svg" />
      </div>
      <div className="w-full py-10 flex flex-col justify-center items-center">
        <div className="title text-4xl font-bold">
          <h1>Signup</h1>
        </div>
        <form onSubmit={handleSubmit} className="form space-y-4 p-4">
          <input
            className="px-2 py-2 w-full rounded-lg border-2 border-accent focus:bg-secondary"
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="px-2 py-2 w-full rounded-lg border-2 border-accent focus:bg-secondary"
            type="password"
            id="password"
            autoComplete="off"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white rounded-lg w-full hover:bg-secondary"
          >
            Sign Up
          </button>
        </form>
        <div className="social">
          <button
            onClick={googlesignup}
            className="rounded-lg px-3 py-2 bg-red-500 text-white hover:bg-red-800"
          >
            Sign up with Google
          </button>
        </div>
        <div className="dont-have-account hover:underline">
          <Link to={"/login"}>
            <p>Already have an account? Sign in</p>
          </Link>
        </div>
      </div>
      <div className="foot w-full">
        <Footer />
      </div>
    </div>
  );
}
