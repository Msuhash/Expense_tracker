import React from 'react'
import { GiFireDash } from "react-icons/gi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


const SignUpForm = ({ setShowPages, onSubmit }) => {

  let schema = Yup.object().shape({
    username: Yup.string().required("UserName Is Required").matches(/^[0-9A-Za-z]{6,12}$/, "Enter valid Username"),
    email: Yup.string().required("Email Is Required").email("Enter Valid Email"),
    password: Yup.string().required("Enter The password").min(8, "Password Must Have atleast 8 Characters")
      .matches(/^(?=.*[0-9])(?=.*[A-Za-z]).{8,32}$/, "Password must include letters and number")
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <div>
      <div className='flex justify-center items-center pb-5'>
        <ul className='flex justify-center items-center gap-3 bg-gradient-to-l from-orange-900 to-orange-500 bg-clip-text text-transparent'>
          <li><FaIndianRupeeSign className='text-orange-500 text-6xl' /></li>
          <li>
            <p className='font-semibold text-2xl'>SignUp to Track Expense</p>
          </li>
          <li><GiFireDash className='text-amber-700 text-4xl' /></li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>
        <fieldset className="fieldset grid grid-cols-1 gap-5 bg-black border-amber-600 rounded-box w-xs border-2 p-4">
          <legend className="fieldset-legend text-amber-600">
            Create New Account
          </legend>

          <label className="floating-label">
            <span>UserName</span>
            <input type="text" {...register("username")} className={`input outline-1 border-none ${errors.username ? "outline-red-700 focus:outline-red-700" : "outline-amber-700 focus:outline-amber-800"}`} placeholder="Enter Your UserName" />
          </label>
          {errors.username && <p className='text-red-700'>{errors.username.message}</p>}

          <label className="floating-label">
            <span>Email</span>
            <input
              type="email"
              className={`input outline-1 border-none ${errors.email ? "outline-red-700 focus:outline-red-700" : "outline-amber-700 focus:outline-amber-800"}`}
              placeholder="Enter Your Email" {...register("email")}
            />
          </label>
          {errors.email && <p className='text-red-700'>{errors.email.message}</p>}

          <label className="floating-label">
            <span>Set Password</span>
            <input
              type="password"
              className={`input outline-1 border-none ${errors.password ? "outline-red-700 focus:outline-red-700" : "outline-amber-700 focus:outline-amber-800"}`}
              placeholder="Enter The Password" {...register("password")}
            />
          </label>
          {errors.password && <p className='text-red-700'>{errors.password.message}</p>}

          <button type='submit' className="btn bg-amber-600 border-none shadow-none">SignUp</button>
        </fieldset>
      </form>

      <div className='flex justify-center items-center mt-4 text-sm'>
        <p className='text-amber-600'>Already Have An Account? <span className='text-amber-300 hover:cursor-pointer' onClick={() => { setShowPages("login") }}>Login</span></p>
      </div>
    </div>
  );
}

export default SignUpForm
