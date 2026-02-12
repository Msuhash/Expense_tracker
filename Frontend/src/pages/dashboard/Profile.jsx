import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserData, updateUsername, updatePassword, logoutUser } from "../../store/slices/authSlice"
import { MdVerifiedUser } from "react-icons/md";
import { GoUnverified } from "react-icons/go";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const [newUsername, setNewUsername] = React.useState("");
  const [passwordData, setPasswordData] = React.useState({
    currentpassword: "",
    newPassword: "",
    confirmPassword: ""
  });



  // Update local state when user data is fetched
  useEffect(() => {
    if (user?.name) {
      setNewUsername(user.name);
    }
  }, [user]);

  const handleUpdateUsername = () => {
    try {
      if (newUsername.trim()) {
        dispatch(updateUsername(newUsername)).then(() => {
          setIsEditingUsername(false);
        });
      }
      toast.success("Username updated successfully");
    }
    catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdatePassword = () => {
    const { currentpassword, newPassword, confirmPassword } = passwordData;
    try {
      if (currentpassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        dispatch(updatePassword(passwordData)).then((res) => {
          if (!res.error) {
            setIsChangingPassword(false);
            setPasswordData({ currentpassword: "", newPassword: "", confirmPassword: "" });
          }
        });
      }
      dispatch(logoutUser());
      toast.success("Password updated successfully");
      navigate("/");
    }
    catch (error) {
      toast.error(error.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className='p-4 text-center text-amber-500'>Loading...</div>
  }

  if (!user) {
    return <div className='p-4 text-center text-red-500'>User data not found.</div>
  }

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-4xl mx-auto'>
      <h6 className='text-amber-500 text-center text-xl md:text-2xl font-sans font-bold mb-6 md:mb-8'>Profile Setting</h6>

      <div className='flex flex-col justify-center items-center mt-4'>
        <span className='flex justify-center items-center text-4xl md:text-6xl rounded-full border-2 border-amber-400 h-24 w-24 md:h-32 md:w-32 bg-gray-900 text-amber-400 font-bold'>{user.name?.charAt(0).toUpperCase()}</span>
        <div className='flex items-center justify-center gap-2 text-lg md:text-xl mt-2'>
          <h6 className='text-amber-500 text-center font-sans font-bold mt-2 text-base md:text-lg'>{user.name}</h6>
          {user.isAuthenticated ? (
            <span className='mt-2 text-lime-600'><MdVerifiedUser size={25} /></span>
          ) : (
            <span className='mt-2 text-red-600'><GoUnverified size={25} /></span>
          )}
        </div>
      </div>

      {/* Username Section */}
      <div className='bg-gray-950 rounded-xl shadow-md p-4 md:p-6 border-x-4 md:border-x-8 border-y-1 border-y-gray-700 border-x-amber-700 transition-all duration-300 ease-in-out hover:scale-105'>
        <div className='flex items-center gap-2 mb-4 md:mb-6'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-amber-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <h2 className='text-base md:text-lg font-semibold text-amber-500'>Username</h2>
        </div>

        {isEditingUsername ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>New Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className='w-full bg-black text-amber-700 placeholder-amber-700 border border-amber-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500'
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-3 md:gap-4'>
              <button
                onClick={handleUpdateUsername}
                className='flex-1 bg-black text-amber-700 border border-amber-700 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2'
              >
                <span>✓</span> Save
              </button>
              <button
                onClick={() => {
                  setIsEditingUsername(false);
                  setNewUsername(user.name);
                }}
                className='flex-1 border border-amber-700 text-amber-700 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2'
              >
                <span>✕</span> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex-1'>
              <p className='text-gray-500 text-sm mb-1'>Current Username</p>
              <div className='flex items-center gap-2'>
                <p className='text-lg md:text-xl font-medium text-amber-700'>{user.name}</p>
                {user.isAuthenticated && <MdVerifiedUser className="text-lime-600" size={20} />}
              </div>
            </div>
            <button
              onClick={() => setIsEditingUsername(true)}
              className='flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-amber-700 border border-amber-700 rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className='bg-gray-950 rounded-xl shadow-md p-4 md:p-6 border-x-4 md:border-x-8 border-y-1 border-y-gray-700 border-x-amber-700 transition-all duration-300 ease-in-out hover:scale-105'>
        <div className='flex items-center gap-2 mb-4 md:mb-6'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-amber-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <h2 className='text-base md:text-lg font-semibold text-amber-500'>Password</h2>
        </div>

        {isChangingPassword ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
              <input
                type="password"
                name="currentpassword"
                placeholder="Enter current password"
                value={passwordData.currentpassword}
                onChange={handlePasswordChange}
                className='w-full bg-black text-amber-700 placeholder-amber-900 border-2 border-amber-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className='w-full bg-black text-amber-700 placeholder-amber-900 border-2 border-amber-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className='w-full bg-black text-amber-700 placeholder-amber-900 border-2 border-amber-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500'
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-3 md:gap-4'>
              <button
                onClick={handleUpdatePassword}
                className='flex-1 bg-black text-amber-700 border-2 border-amber-700 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2'
              >
                <span>✓</span> Update Password
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ currentpassword: "", newPassword: "", confirmPassword: "" });
                }}
                className='flex-1 border border-amber-700 text-amber-700 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2'
              >
                <span>✕</span> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex-1'>
              <p className='text-gray-500 text-sm mb-1'>Password</p>
              <p className='text-lg md:text-xl font-medium tracking-widest text-amber-700'>••••••••</p>
            </div>
            <button
              onClick={() => setIsChangingPassword(true)}
              className='flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base border border-amber-700 text-amber-700 rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Change
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
