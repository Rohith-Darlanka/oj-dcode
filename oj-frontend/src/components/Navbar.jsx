import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const baseClass = "px-3 py-2 rounded-md text-sm font-medium";
  const activeClass = "bg-green-600 text-white";
  const inactiveClass = "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <nav className="bg-black px-6 py-3 flex space-x-4">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/problemset"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Problemset
      </NavLink>
      <NavLink
        to="/help"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Help
      </NavLink>
    </nav>
  );
};

export default Navbar;
