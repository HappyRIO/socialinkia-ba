import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    window.location.href = "/subscription";
  }, []);

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
        navigate("/signup/details"); // Use navigate for internal routing
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

  // useEffect(() => {
  //   window.addEventListener("message", (event) => {
  //     // console.log(event.data.redirectUrl);
  //     window.location.href = event.data.redirectUrl;
  //   });
  // }, []);

  const googlesignup = () => {
    const backendUrl = `${
      import.meta.env.VITE_SERVER_BASE_URL
    }/api/google/auth/google?redirectToDashboard=true`;
    const authWindow = window.open(
      backendUrl,
      "_blank",
      "width=500,height=600"
    );
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* <div className="nav w-full">
        <Header />
      </div>
      <div className="icon">
        <img src="/Login-bro.svg" alt="login svg" />
      </div>
      <div className="w-full py-32 flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="form space-y-4 p-4">
          <input
            className="px-2 py-2 w-full rounded-lg border-accent focus:bg-secondary"
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="px-2 py-2 w-full rounded-lg border-accent focus:bg-secondary"
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
      </div> */}
    </div>
  );
}
