import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import logo from "../assets/elogo.png";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Footer from "../components/layout/Footer";

const EntryPage = () => {
  let isAuthenticated = !!localStorage.getItem("token");

  const [showButton, setShowButton] = useState(false);
  const [showPages, setShowPages] = useState("welcome");

  let handleHiddenButton = () => {
    setShowButton((prev) => !prev);
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
                            onClick={() => setShowPages("login")}
                          >
                            Login
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn btn-warning px-4"
                            onClick={() => setShowPages("signup")}
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
                <Login setShowPages = {setShowPages} />
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
                <SignUp setShowPages = {setShowPages} />
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
