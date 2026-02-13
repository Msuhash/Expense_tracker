import React, { useState } from 'react'
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logout, fetchUserData } from '../../store/slices/authSlice';
import { resetPassword } from '../../services/authServices';

const ResetPasswordPage = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    newPassword: Yup.string().required("Enter new Password").min(8, "Password Must Have atleast 8 Characters")
      .matches(/^(?=.*[0-9])(?=.*[A-Za-z]).{8,32}$/, "Password must include letters and number"),

    cPassword: Yup.string().required("Enter Same Password").oneOf([Yup.ref("newPassword"), null], "Password Must Match")

  })


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const onSubmit = async (data) => {
    let res;
    try {
      res = await resetPassword(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
      return;
    }

    if (res && res.success) {
      toast.success(res.message);
      dispatch(fetchUserData());
      onSuccess();
    } else {
      toast.error(res?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>
        <fieldset className="fieldset grid grid-cols-1 gap-5 bg-black border-amber-600 rounded-box w-xs border-2 p-4">
          <h1 className="text-amber-600 text-2xl font-bold text-center">
            Reset Password
          </h1>

          <p className='text-center pb-2 text-xs font-semibold text-amber-600'>Enter New Password To Reset</p>

          <label className="floating-label relative">
            <span>Set New Password</span>
            <input
              type={showNewPassword ? "text" : "password"}
              className={`input w-full pr-10 outline-1 border-none ${errors.newPassword ? "outline-red-700 focus:outline-red-700" : "outline-amber-700 focus:outline-amber-800"}`}
              placeholder="Enter New Password" {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-500 focus:outline-none cursor-pointer z-10"
            >
              {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </label>
          {errors.newPassword && <p className='text-red-700'>{errors.newPassword.message}</p>}

          <label className="floating-label relative">
            <span>Confirm Password</span>
            <input
              type={showCPassword ? "text" : "password"}
              className={`input w-full pr-10 outline-1 border-none ${errors.cPassword ? "outline-red-700 focus:outline-red-700" : "outline-amber-700 focus:outline-amber-800"}`}
              placeholder="Enter Same Password" {...register("cPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCPassword(!showCPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-500 focus:outline-none cursor-pointer z-10"
            >
              {showCPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </label>
          {errors.cPassword && <p className='text-red-700'>{errors.cPassword.message}</p>}

          <button type='submit' className="btn bg-amber-600 border-none shadow-none">Submit</button>
        </fieldset>
      </form>
    </div>
  )
}

export default ResetPasswordPage
