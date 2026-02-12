import React from 'react'
import { IoLogoLinkedin } from "react-icons/io5";
import { FaSquareGithub } from "react-icons/fa6";
import { ImMail3 } from "react-icons/im";

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-gradient-to-r from-black to-amber-950 text-amber-600 items-center p-4">
        <aside className="grid-flow-col items-center">
          <p>Copyright © {new Date().getFullYear()} Cashflow - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 justify-items-center md:place-self-center md:justify-self-end">
          <a>
            <IoLogoLinkedin size={25}/>
          </a>
          <a>
            <FaSquareGithub size={25}/>
          </a>
          <a>
            <ImMail3 size={25}/>
          </a>
        </nav>
      </footer>
    </div>
  );
}

export default Footer
