import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  function googlelogin() {
    const backendUrl = `${import.meta.env.SERVER_BASE_URL}/api/google/auth/google`; // Replace with your actual backend URL
    window.open(backendUrl, "_blank", "width=500,height=600");
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="form space-y-4 p-4">
        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div className="social">
        <button
          onClick={googlelogin}
          className="rounded-lg px-3 py-2 bg-red-500 text-white"
        >
          login with google{" "}
        </button>
      </div>
      <div className="dont-have-account">
        <Link to={"/signup"}>
          <p>dont have an account? sign up</p>
        </Link>
      </div>
    </div>
  );
}
