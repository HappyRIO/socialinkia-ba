import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
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
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        window.location.href = "/signup/details";
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  function googlesignin() {
    const backendUrl = `${
      import.meta.env.SERVER_BASE_URL
    }/api/google/auth/google`; // Replace with your actual backend URL
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
          Sign Up
        </button>
      </form>
      <div className="social">
        <button
          onClick={googlesignin}
          className="rounded-lg px-3 py-2 bg-red-500 text-white"
        >
          signup with google{" "}
        </button>
      </div>
      <div className="dont-have-account">
        <Link to={"/login"}>
          <p>already have an account? sign in</p>
        </Link>
      </div>
    </div>
  );
}
