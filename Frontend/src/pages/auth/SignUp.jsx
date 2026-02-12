import React, { useState } from 'react'
import SignUpForm from '../../components/forms/SignUpForm'
import { signUp } from '../../services/authServices'
import VerifyOtpPage from './VerifyOtpPage'
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify'
import { FourSquare } from 'react-loading-indicators'



const SignUp = ({ setShowPages }) => {

  const [verifyPage, setVerifyPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUpData = async (formData) => {
    console.log(formData)
    setIsLoading(true)
    try {
      const res = await signUp(formData)

      console.log(res)

      if (res.success) {
        toast.success("signUp successfully! Now Verify Your Account")
        setVerifyPage(true)
      }
      else {
        toast.error(res?.message || "Registration failed")
      }

    }
    catch (error) {
      toast.error(error.response?.data?.message || "something went wrong")
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

    <div className='w-full'>
      <AnimatePresence mode="wait">
        {!verifyPage && (
          <motion.div
            key="signup" // 👈 unique key for SignUpForm
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <SignUpForm setShowPages={setShowPages} onSubmit={handleSignUpData} />
          </motion.div>
        )}

        {verifyPage && (
          <motion.div
            key="verifyOtp" // 👈 unique key for VerifyOtpPage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <VerifyOtpPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SignUp
