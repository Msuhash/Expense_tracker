import React from 'react'
import { Link } from 'react-router-dom';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { TbCategoryPlus } from "react-icons/tb";
import { GiExpense } from "react-icons/gi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const Sidebar = ({ children }) => {

  return (
    <div className="drawer lg:drawer-open h-[calc(100vh-4.5rem)]">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col h-full overflow-hidden">
        {/* Mobile Toggle Button */}
        <div className="w-full bg-black lg:hidden p-4 border-b-2 border-amber-950">
          <label htmlFor="my-drawer-3" className="btn btn-square border-amber-600 text-amber-600 bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>
        </div>

        {/* Page Content */}
        <div className='w-full h-full bg-black overflow-y-auto'>
          {children}
        </div>
      </div>
      <div className="drawer-side h-full z-20">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu flex flex-col gap-5 border-r-2 border-amber-950 bg-black h-full w-65 p-5 text-amber-600 bg-gradient-to-b from-black to-amber-950">
          {/* Sidebar content here */}
          <li className='hover:bg-amber-950 rounded-lg'><Link to="/dashboard"><TbLayoutDashboardFilled size={25} /> Dashboard & Analytics</Link></li>
          <li className='hover:bg-amber-950 rounded-lg'><Link to="/category"><TbCategoryPlus size={25} /> Categories</Link></li>
          <li className='hover:bg-amber-950 rounded-lg'><Link to="/expense"><GiExpense size={25} />Expenses</Link></li>
          <li className='hover:bg-amber-950 rounded-lg'><Link to="/income"><RiMoneyRupeeCircleFill size={25} />Income</Link></li>
          <li className='hover:bg-gray-950 rounded-lg mt-auto'><Link to="/profile"><CgProfile size={25} />Profile</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
