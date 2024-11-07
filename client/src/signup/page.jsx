import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
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

  const googlesignin = () => {
    const backendUrl = `${
      import.meta.env.VITE_SERVER_BASE_URL
    }/api/google/auth/google`; // Replace with your actual backend URL
    console.log(backendUrl);
    window.open(backendUrl, "_blank", "width=500,height=600");
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="form space-y-4 p-4">
        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="email"
          id="email"
          autoComplete="off"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
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
          Sign up with Google
        </button>
      </div>
      <div className="dont-have-account">
        <Link to={"/login"}>
          <p>Already have an account? Sign in</p>
        </Link>
      </div>
    </div>
  );
}
