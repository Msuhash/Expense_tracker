import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { setIsLoading } from '../../store/slices/uiSlice';
import { checkIsAuth } from '../../services/authServices';
import { toast } from 'react-toastify';
import ResetOtpPage from './ResetOtpPage.jsx';
import ResetPasswordPage from './ResetPasswordPage.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import EntryPage from '../EntryPage';

const ResetEmailPage = () => {

  const navigate = useNavigate();

  const isLoading = useSelector(state => state.ui.isLoading)
  const [step, setStep] = useState('email') // 'email', 'otp', 'password'
  const [email, setEmail] = useState('')

  let schema = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Enter Valid Email")
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const submitData = async (data) => {
    setEmail(data.email)
    try {

      const res = await checkIsAuth(data.email)

      if (res.success) {
        toast.success("Your Account is Verified")
        setStep('otp')
      }
      else {
        toast.error(res?.message || "something went wrong")
      }

    }
    catch (error) {
      toast.error(error.response?.data?.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        <FourSquare color="#ffea00" size="medium" text="Please Wait!" textColor="" />
      </div>
    )
  }


  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="resetEmail" // 👈 unique key for SignUpForm
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full">
            <form
              onSubmit={handleSubmit(submitData)}
              className="flex flex-col justify-center items-center"
            >
              <fieldset className="fieldset grid grid-cols-1 gap-5 bg-black border-amber-600 rounded-box w-xs border-2 p-4">
                <h1 className="text-amber-600 text-2xl font-bold text-center">
                  Reset Password
                </h1>

                <p className="text-center pb-2 text-xs font-semibold text-amber-600">
                  Enter Registered Email To Get OTP
                </p>

                <label className="floating-label">
                  <span>Email</span>
                  <input
                    type="email"
                    {...register("email")}
                    className={`input outline-1 rounded-4xl border-none ${errors.email
                      ? "outline-red-700 focus:outline-red-700"
                      : "outline-amber-700 focus:outline-amber-800"
                      }`}
                    placeholder="Enter Your Email"
                  />
                </label>
                {errors.email && (
                  <p className="text-red-700">{errors.email.message}</p>
                )}

                <button
                  type="submit"
                  className="btn bg-amber-600 border-none shadow-none rounded-4xl"
                >
                  Submit
                </button>
              </fieldset>
            </form>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="resetOtp" // 👈 unique key for SignUpForm
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full">
            <ResetOtpPage email={email} onOtpVerified={() => setStep('password')} />
          </motion.div>
        )}

        {step === 'password' && (
          <motion.div
            key="resetPassword" // 👈 unique key for SignUpForm
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full">
            <ResetPasswordPage onSuccess={() => navigate('/')} />
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
}

export default ResetEmailPage
