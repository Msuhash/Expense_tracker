import React, { useRef, useEffect, useState } from 'react'
import { sendResetOtp, verifyResetOtp } from '../../services/authServices';
import { toast } from 'react-toastify';

const ResetOtpPage = ({ email, onOtpVerified }) => {

    const inputRef = useRef([])
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const sendOtp = async () => {
            try {
                const res = await sendResetOtp({ email: email });
                if (res.success) {
                    toast.success(res.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to send OTP");
            }
        };

        if (email) {
            sendOtp();
        }
    }, [email]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResendOtp = async () => {
        if (timer > 0) return;
        try {
            const res = await sendResetOtp({ email: email });
            if (res.success) {
                toast.success(res.message);
                setTimer(30);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === '' && index > 0) {
            inputRef.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text")
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char
            }

        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = inputRef.current.map(input => input.value).join('');
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            const res = await verifyResetOtp({ email, otp });
            if (res.success) {
                toast.success(res.message);
                onOtpVerified();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='w-96 rounded-md p-5 border border-amber-700'>
                <h1 className='text-center p-4 text-2xl font-bold text-amber-600'>Reset OTP</h1>
                <p className='text-center pb-8 text-sm font-semibold text-amber-600'>Reset OTP Sent To Your Account</p>
                <div className='flex justify-between pb-4' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input key={index}
                            type="text"//
                            maxLength={1}
                            required
                            ref={e => inputRef.current[index] = e}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className='text-amber-600 rounded-md w-12 h-12 text-xl text-center border border-amber-700 focus: outline-none'
                        />
                    ))}
                </div>
                <div className='flex justify-between items-center pb-8'>
                    <p className='text-xs font-semibold text-amber-600'>Enter 6 digit OTP to Reset your account Password</p>
                    {timer > 0 ? (
                        <span className='text-xs font-semibold text-gray-500'>Resend in {timer}s</span>
                    ) : (
                        <button type="button" onClick={handleResendOtp} className='text-xs font-bold text-amber-600 hover:underline cursor-pointer'>Resend OTP</button>
                    )}
                </div>
                <button className='btn btn-warning w-full rounded-4xl'>Submit</button>

            </form>
        </div>
    )
}

export default ResetOtpPage
