import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import accountAPI from "../../services/Account/accountAPI";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    const response = await accountAPI.login(data);
    console.log(data);
    if (response.status === 200) {
      window.location.href = "/groups";
    } else {
      alert("Login failed");
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-200 to-gray-900 relative overflow-hidden font-sans">
        {/* Background image overlay */}
        <img
          src="https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=900&q=80"
          alt="Cinema"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          style={{ zIndex: 0 }}
        />
        {/* Red-black overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-red-200/30 to-black/50"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="relative z-10 bg-white/80 shadow-xl rounded-xl px-2 py-6 w-full max-w-xs sm:max-w-lg md:max-w-md border border-red-200 backdrop-blur-md
        sm:px-6 sm:py-8
        md:px-10 md:py-12
        "
        >
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 text-center tracking-wide drop-shadow font-sans">
              Login
            </h1>
          </div>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-red-700 font-semibold mb-2 font-sans"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-red-200 bg-white/70 text-gray-900 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-300 transition shadow-sm"
                placeholder="Enter your email"
                autoComplete="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div>
              <label
                className="block text-red-700 font-semibold mb-2 font-sans"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 sm:p  x-4 sm:py-3 rounded-lg border border-red-200 bg-white/70 text-gray-900 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-300 transition shadow-sm"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-3 mt-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg shadow-md hover:scale-105 hover:from-red-500 hover:to-red-700 transition-all duration-200 border border-red-300 font-sans tracking-wide"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
          <div className="mt-6 sm:mt-8 text-center">
            <span className="text-red-700 font-sans">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="ml-2 text-red-500 font-semibold hover:underline hover:text-red-700 transition font-sans"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
