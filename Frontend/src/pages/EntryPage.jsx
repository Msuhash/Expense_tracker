import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/elogo.png";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Footer from "../components/layout/Footer";

const EntryPage = ({ initialPage = "welcome" }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;

  const navigate = useNavigate();
  const location = useLocation();

  const getActivePage = () => {
    if (location.pathname === "/login") return "login";
    if (location.pathname === "/signUp" || location.pathname === "/signup") return "signup";
    return initialPage;
  };

  const showPages = getActivePage();
  const [showButton, setShowButton] = useState(false);

  const handleHiddenButton = () => {
    setShowButton((prev) => !prev);
  };

  const handlePageChange = (page) => {
    if (page === "login") {
      navigate("/login");
    } else if (page === "signup") {
      navigate("/signUp");
    } else {
      navigate("/");
    }
  };

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-black text-white">
      <main className="flex flex-1 overflow-hidden">
        {/* left side illustration */}
        <div
          className="hidden lg:flex justify-center items-center w-1/2 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${logo})` }}
        ></div>

        {/* right side container */}
        <div className="flex justify-center items-center w-full lg:w-1/2 overflow-hidden">
          <AnimatePresence mode="wait">
            {showPages === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col gap-7 justify-center items-center p-5 w-full"
              >
                <p className="text-amber-600 font-semibold text-2xl md:text-4xl">
                  Welcome to Cashflow
                </p>
                <p className="text-amber-700 font-semibold text-lg md:text-xl">
                  A Expense Tracker App
                </p>
                <button className="btn btn-warning" onClick={handleHiddenButton}>
                  let's Start
                </button>

                <div className="min-h-[60px] flex justify-center items-center">
                  <AnimatePresence>
                    {showButton && (
                      <motion.ul
                        className="flex gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <li>
                          <button
                            className="btn btn-warning px-5"
                            onClick={() => handlePageChange("login")}
                          >
                            Login
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn btn-warning px-4"
                            onClick={() => handlePageChange("signup")}
                          >
                            SignUp
                          </button>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {showPages === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <Login setShowPages={handlePageChange} />
              </motion.div>
            )}

            {showPages === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex justify-center items-center w-full"
              >
                <SignUp setShowPages={handlePageChange} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <div>
        <Footer/>
      </div>
      
    </div>
  );
};

export default EntryPage;
