import React, { useState } from 'react'
import { GiFireDash } from "react-icons/gi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ResetEmailPage from '../../pages/auth/ResetEmailPage';
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';

const LoginForm = ({setShowPages, onSubmit}) => {
  
  const [changePage, setChangePage] = useState(false)
  const dispatch = useDispatch()
  const isLoading = useSelector(state=> state.ui.isLoading)
  
  let schema = Yup.object().shape({
      email : Yup.string().required("Email Is Required").email("Enter Valid Email"),
      password : Yup.string().required("Enter The password").min(8,"Password Must Have atleast 8 Characters")
      .matches(/^(?=.*[0-9])(?=.*[A-Za-z]).{8,32}$/, "Password must include letters and number")
    })
  
    const {register, handleSubmit, formState: {errors}} = useForm({
      resolver : yupResolver(schema)
    });


  return (
    <div>
      {!changePage && (
        <>
          <div className="flex justify-center items-center pb-10">
            <ul className="flex justify-center items-center gap-3 bg-gradient-to-l from-orange-900 to-orange-500 bg-clip-text text-transparent">
              <li>
                <FaIndianRupeeSign className="text-orange-500 text-6xl" />
              </li>
              <li>
                <p className="font-semibold text-2xl">Login to Track Expense</p>
              </li>
              <li>
                <GiFireDash className="text-amber-700 text-4xl" />
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center"
          >
            <fieldset className="fieldset grid grid-cols-1 gap-5 bg-black border-amber-600 rounded-box w-xs border-2 p-4">
              <legend className="fieldset-legend text-amber-600">
                Login to Start
              </legend>

              <label className="floating-label">
                <span>Email</span>
                <input
                  type="email"
                  {...register("email")}
                  className={`input outline-1 border-none ${
                    errors.email
                      ? "outline-red-700 focus:outline-red-700"
                      : "outline-amber-700 focus:outline-amber-800"
                  }`}
                  placeholder="Enter Your Email"
                />
              </label>
              {errors.email && (
                <p className="text-red-700">{errors.email.message}</p>
              )}

              <label className="floating-label">
                <span>Password</span>
                <input
                  type="password"
                  {...register("password")}
                  className={`input outline-1 border-none ${
                    errors.password
                      ? "outline-red-700 focus:outline-red-700"
                      : "outline-amber-700 focus:outline-amber-800"
                  }`}
                  placeholder="Enter Your Password"
                />
              </label>
              {errors.password && (
                <p className="text-red-700">{errors.password.message}</p>
              )}

              <span className="text-xs text-amber-700 underline focus: cursor-pointer" onClick={()=>setChangePage(true)}>
                Forget Password?
              </span>
              <button
                type="submit"
                className="btn bg-amber-600 border-none shadow-none"
              >
                Login
              </button>
            </fieldset>
          </form>

          <div className="flex justify-center items-center mt-4 text-sm">
            <p className="text-amber-600">
              Create A New Account?{" "}
              <span
                className="text-amber-300 hover:cursor-pointer"
                onClick={() => {
                  setShowPages("signup");
                }}
              >
                SignUp
              </span>
            </p>
          </div>
        </>
      )}
      
      <AnimatePresence mode="wait">
      {changePage && (
        <motion.div
          key="resetEmail" // 👈 unique key for SignUpForm
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full">
          <ResetEmailPage/>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default LoginForm
