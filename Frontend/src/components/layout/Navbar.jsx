import React from 'react'
import { SiMoneygram } from "react-icons/si";
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { logoutUser } from "../../store/slices/authSlice"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <div className='h-[4.5rem] flex items-center justify-between bg-gradient-to-r border-b-2 border-amber-950 from-black to-amber-950 text-amber-600 w-full m-auto px-4 md:px-8'>
      <ul className='flex justify-start items-center gap-2'>
        <li><SiMoneygram /></li>
        <li>Cashflow</li>
      </ul>

      {user && (
        <div>
          <Dialog>
            <DialogTrigger className='text-amber-500 bg-black text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 border-1 border-gray-800 hover:border-yellow-600'>{user.name?.charAt(0).toUpperCase()}</DialogTrigger>
            <DialogContent className='bg-black text-amber-500 border-amber-950 w-[90%] sm:w-full sm:max-w-md fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-xl'>
              <DialogHeader>
                <DialogTitle className="text-center sm:text-left text-xl">{user.name}</DialogTitle>
                <DialogDescription className="text-center sm:text-left text-amber-500/80">
                  {user.email}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline" className='bg-black text-amber-500 border-2 border-amber-950 hover:bg-gray-900 hover:text-amber-500 w-full sm:w-auto'>Cancel</Button>
                </DialogClose>
                <Button onClick={handleLogout} className='bg-red-600 text-black border-2 border-red-950 hover:bg-red-800 hover:text-black w-full sm:w-auto'>Logout</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default Navbar
