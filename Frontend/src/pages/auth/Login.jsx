import React from 'react'
import LoginForm from '../../components/forms/LoginForm'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { FourSquare } from 'react-loading-indicators'
import { setIsLoading } from '../../store/slices/uiSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { fetchUserData } from '../../store/slices/authSlice'

const Login = ({ setShowPages }) => {

  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.ui.isLoading)

  const navigate = useNavigate()

  const handleLoginData = async (loginData) => {
    console.log(loginData)
    dispatch(setIsLoading(true))

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", loginData, {
        withCredentials: true
      })

      if (res.data.success) {
        dispatch(fetchUserData())
        toast.success("Login Successfully")
        navigate("/dashboard")
      }
      else {
        toast.error(res.data?.message || "something went wrong")
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message || "something Went Wrong")
    }
    finally {
      dispatch(setIsLoading(false))
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
    <div className='flex items-center justify-center'>
      <LoginForm setShowPages={setShowPages} onSubmit={handleLoginData} />
    </div>
  )
}

export default Login
