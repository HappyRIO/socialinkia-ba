import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/fragments/Loader";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const googlelogin = () => {
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
      <div className="nav w-full">
        <Header />
      </div>
      <div className="icon">
        <img src="/Login-bro.svg" alt="login svg" />
      </div>
      <div className="w-full py-32 flex flex-col justify-center items-center">
        {loading && <Loader />}
        <form onSubmit={handleSubmit} className="form space-y-4 p-4">
          <input
            className="px-2 py-2 w-full rounded-lg border-secondary focus:border-accent"
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="px-2 py-2 w-full rounded-lg border-secondary focus:border-accent"
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
            Login
          </button>
        </form>
        <div className="social">
          <button
            onClick={googlelogin}
            className="rounded-lg px-3 py-2 bg-red-500 text-white hover:bg-red-800"
          >
            Login with Google
          </button>
        </div>
        <div className="dont-have-account hover:underline hover:text-primary">
          <Link to={"/signup"}>
            <p>Dont have an account? Sign up</p>
          </Link>
        </div>
      </div>
      <div className="footer w-full">
        <Footer />
      </div>
    </div>
  );
}
