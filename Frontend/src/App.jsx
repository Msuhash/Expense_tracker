import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './store/slices/authSlice';
import { FourSquare } from "react-loading-indicators"; // Import loader


import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Income from './pages/dashboard/Income';
import Expense from './pages/dashboard/Expense';
import Category from './pages/dashboard/Category';
import Profile from './pages/dashboard/Profile';
import Report from './pages/dashboard/Report';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

import EntryPage from './pages/EntryPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ResetOtpPage from './pages/auth/ResetOtpPage';
import ResetEmailPage from './pages/auth/ResetEmailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";






function App() {

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen bg-black'>
        <FourSquare color="#ffea00" size="medium" text="" textColor="" />
      </div>
    )
  }


  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {user ? (
            <Route element={<Sidebar><Outlet /></Sidebar>}>
              <Route path='/' element={<Navigate to="/dashboard" replace />} />
              <Route path='/dashboard' element={<Report />} />
              <Route path='/income' element={<Income />} />
              <Route path='/expense' element={<Expense />} />
              <Route path='/category' element={<Category />} />
              <Route path='/profile' element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

          ) : (
            <>
              <Route path='/' element={<EntryPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signUp' element={<SignUp />} />
              <Route path='/verifyOtpPage' element={<VerifyOtpPage />} />
              <Route path='/resetOtpPage' element={<ResetOtpPage />} />
              <Route path='/resetEmailPage' element={<ResetEmailPage />} />
              <Route path='/resetPasswordPage' element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
          {/* <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/verifyOtpPage' element={<VerifyOtpPage />} />
          <Route path='/resetOtpPage' element={<ResetOtpPage />} />
          <Route path='/resetEmailPage' element={<ResetEmailPage />} />
          <Route path='/resetPasswordPage' element={<ResetPasswordPage />} /> */}
          {/* <Route element={<Sidebar><Outlet /></Sidebar>}>
            <Route path='/dashboard' element={<Report />} />
            <Route path='/income' element={<Income />} />
            <Route path='/expense' element={<Expense />} />
            <Route path='/category' element={<Category />} />
            <Route path='/profile' element={<Profile />} />
          </Route> */}
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} theme='dark' />

    </>
  );
}

export default App
