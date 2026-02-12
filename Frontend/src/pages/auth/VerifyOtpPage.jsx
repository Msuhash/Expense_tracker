import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import{FourSquare} from 'react-loading-indicators'

const VerifyOtpPage = () => {

    const inputRef = useRef([])
    const navigate= useNavigate()
    const [isLoading, setIsLoading] =useState(false)
    const otpSentRef = useRef(false);

     
    // to send otp to verify account
    useEffect(() =>{
        if (otpSentRef.current) return; // Already sent, skip
        otpSentRef.current = true;
        
        const sendOtp = async() =>{
            try{
                const res = await axios.post("http://localhost:8000/api/auth/send-verify-otp", {}, {
                    withCredentials: true
                })

                if(res.data.success){
                    toast.success("Verification OTP Sent To Your Account")
                }
                else{
                    toast.error(res.data?.message || "OTP creation failed")
                }

            }
            catch(error){
                toast.error(error.response?.data?.message || "OTP can't able to send! Try Again")
            }
        }

        sendOtp()
    },[])

    const handleOtp = async (e) =>{
        e.preventDefault()
        setIsLoading(true)

        const fullOtp = inputRef.current.map(input => input.value).join('')

        if(fullOtp < 6){
            return toast.error("please enter 6 digit OTP")
        }

        try{
            const res = await axios.post("http://localhost:8000/api/auth/verifyotp", {otp: fullOtp},{
                withCredentials: true
            })

            if(res.data.success){
                toast.success("Account Verified Successfully!")
                navigate("/dashboard")
            }
            else{
                toast.error(res.data?.message || "something went Wrong")
            }

        }
        catch(error){
            toast.error(error.response?.data?.message || "Something Went Wrong")
        }
        finally{
            setIsLoading(false)
        }

    }


    // to handle input focus to next when digit is entered
    const handleInput = (e, index) =>{
        if(e.target.value.length > 0 && index < inputRef.current.length-1){
            inputRef.current[index+1].focus()
        }
    }   

    // to handle backspace to delete previous digit
    const handleKeyDown = (e,index) => {
        if(e.key === "Backspace" && e.target.value === '' && index > 0){
            inputRef.current[index-1].focus()
        }
    }

    // to handle the paste option
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text")
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if(inputRef.current[index]){
                inputRef.current[index].value = char
            }
            
        });
    }

    if(isLoading){
    return (
      <div className='flex justify-center items-center'>
        <FourSquare color="#ffea00" size="medium" text="Please Wait!" textColor="" />
      </div>
    )
  }


  return (
    <div className='flex justify-center items-center'>
      <form className='w-96 rounded-md p-5 border border-amber-700' onSubmit={handleOtp}>
        <h1 className='text-center p-4 text-2xl font-bold text-amber-600'>Account Verification</h1>
        <p className='text-center pb-8 text-sm font-semibold text-amber-600'>Verification OTP Sent To Your Account</p>
        <div className='flex justify-between pb-4' onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
                <input key={index} 
                type="text"
                maxLength={1}
                required
                ref={e => inputRef.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className='text-amber-600 rounded-md w-12 h-12 text-xl text-center border border-amber-700 focus: outline-none'
                />
            ))}
        </div>
        <p className='pb-8 text-xs font-semibold text-amber-600'>Enter 6 digit OTP to verify your account</p>
        <button type='submit' className='btn btn-warning w-full rounded-4xl'>Submit</button>

      </form>
    </div>
  )
}

export default VerifyOtpPage
