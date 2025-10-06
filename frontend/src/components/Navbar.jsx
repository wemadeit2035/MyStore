import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setShowSearch, getCartCount, token, userProfile, logout } =
    useContext(ShopContext);

  // Only show search icon on non-collection pages
  const showSearchIcon = !location.pathname.includes("collection");

  const handleSearchClick = () => {
    if (location.pathname.includes("collection")) {
      setShowSearch(true);
    } else {
      navigate("/collection");
      setTimeout(() => setShowSearch(true), 100);
    }
  };

  const handleProfileClick = () => {
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav
      className="flex items-center px-4 md:px-6 lg:px-10 justify-between py-4 md:py-5 font-medium bg-black"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link to="/" aria-label="Home page" className="flex-shrink-0">
        <img
          src={assets.logo}
          className="w-24 md:w-28 lg:w-32"
          alt="Company Logo"
        />
      </Link>

      {/* Desktop Navigation - Original working structure */}
      <ul
        className="hidden md:flex gap-4 lg:gap-6 text-sm text-white"
        role="menubar"
      >
        <li role="none">
          <NavLink
            to="/"
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-2 py-1 transition-colors duration-200
              ${isActive ? "text-green-400" : "hover:text-green-300"}
            `}
            role="menuitem"
            aria-label="Home page"
          >
            <p className="text-xs lg:text-sm whitespace-nowrap">HOME</p>
            <hr
              className={`w-2/4 border-none h-[1.5px] transition-all duration-200 ${
                isActive ? "bg-green-400" : "bg-white hidden"
              }`}
            />
          </NavLink>
        </li>
        <li role="none">
          <NavLink
            to="/collection"
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-2 py-1 transition-colors duration-200
              ${isActive ? "text-green-400" : "hover:text-green-300"}
            `}
            role="menuitem"
            aria-label="Browse collection"
          >
            <p className="text-xs lg:text-sm whitespace-nowrap">COLLECTION</p>
            <hr
              className={`w-2/4 border-none h-[1.5px] transition-all duration-200 ${
                isActive ? "bg-green-400" : "bg-white hidden"
              }`}
            />
          </NavLink>
        </li>
        <li role="none">
          <NavLink
            to="/about"
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-2 py-1 transition-colors duration-200
              ${isActive ? "text-green-400" : "hover:text-green-300"}
            `}
            role="menuitem"
            aria-label="About us"
          >
            <p className="text-xs lg:text-sm whitespace-nowrap">ABOUT</p>
            <hr
              className={`w-2/4 border-none h-[1.5px] transition-all duration-200 ${
                isActive ? "bg-green-400" : "bg-white hidden"
              }`}
            />
          </NavLink>
        </li>
        <li role="none">
          <NavLink
            to="/contact"
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-2 py-1 transition-colors duration-200
              ${isActive ? "text-green-400" : "hover:text-green-300"}
            `}
            role="menuitem"
            aria-label="Contact us"
          >
            <p className="text-xs lg:text-sm whitespace-nowrap">CONTACT</p>
            <hr
              className={`w-2/4 border-none h-[1.5px] transition-all duration-200 ${
                isActive ? "bg-green-400" : "bg-white hidden"
              }`}
            />
          </NavLink>
        </li>
      </ul>

      <div className="flex items-center gap-4 md:gap-6">
        {showSearchIcon && (
          <button
            onClick={handleSearchClick}
            className="cursor-pointer p-1 hover:opacity-70 transition-opacity"
            aria-label="Search products"
          >
            <img src={assets.search} className="w-4 md:w-5" alt="Search" />
          </button>
        )}

        <Link
          to="/cart"
          className="relative p-1 hover:opacity-70 transition-opacity"
          aria-label="Shopping cart"
        >
          <img
            src={assets.cart_icon}
            className="w-4 md:w-5 min-w-4 md:min-w-5"
            alt="Cart"
          />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-green-500 text-black rounded-full text-[10px] font-bold px-1">
              {getCartCount() > 99 ? "99+" : getCartCount()}
            </span>
          )}
        </Link>

        {/* Profile icon - works for both desktop and mobile */}
        <div className="group relative">
          <button
            onClick={handleProfileClick}
            className="cursor-pointer p-1 hover:opacity-70 transition-opacity"
            aria-label="User profile"
          >
            <img className="w-4 md:w-5" src={assets.profile} alt="Profile" />
          </button>

          {/* Dropdown menu for desktop */}
          {token && (
            <div className="group-hover:block hidden absolute right-0 top-full pt-2 z-50">
              <div
                className="flex flex-col gap-2 w-36 py-3 px-4 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-200"
                role="menu"
              >
                <p className="text-xs text-gray-500 border-b pb-2 font-medium">
                  Hello, {userProfile?.name?.split(" ")[0] || "User"}
                </p>
                <button
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-green-600 text-sm text-left py-1 transition-colors"
                  role="menuitem"
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-green-600 text-sm text-left py-1 transition-colors"
                  role="menuitem"
                >
                  Orders
                </button>
                <button
                  onClick={logout}
                  className="cursor-pointer hover:text-green-600 text-sm text-left py-1 mt-1 pt-2 border-t border-gray-100 transition-colors"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setVisible(true)}
          className="cursor-pointer p-1 md:hidden hover:opacity-70 transition-opacity"
          aria-label="Open menu"
        >
          <img src={assets.menu_icon} className="w-5" alt="Menu" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-black text-white transition-all duration-300 z-50 ${
          visible ? "w-80 max-w-full" : "w-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-hidden={!visible}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link
              to="/"
              onClick={() => setVisible(false)}
              aria-label="Home page"
            >
              <img src={assets.logo} className="w-24" alt="Company Logo" />
            </Link>
            <button
              onClick={() => setVisible(false)}
              className="text-white p-2 hover:text-green-400 transition-colors rounded-lg"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <div className="space-y-2 mb-6" role="menu">
              <NavLink
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 text-base rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-600 text-white font-medium"
                      : "hover:bg-gray-800 hover:text-green-300"
                  }`
                }
                to="/"
                role="menuitem"
              >
                HOME
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 text-base rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-600 text-white font-medium"
                      : "hover:bg-gray-800 hover:text-green-300"
                  }`
                }
                to="/collection"
                role="menuitem"
              >
                COLLECTION
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 text-base rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-600 text-white font-medium"
                      : "hover:bg-gray-800 hover:text-green-300"
                  }`
                }
                to="/about"
                role="menuitem"
              >
                ABOUT
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 text-base rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-600 text-white font-medium"
                      : "hover:bg-gray-800 hover:text-green-300"
                  }`
                }
                to="/contact"
                role="menuitem"
              >
                CONTACT
              </NavLink>
            </div>

            {/* User section */}
            <div className="mt-auto pt-6 border-t border-gray-800">
              {token ? (
                <>
                  <div className="px-4 py-2 text-green-400 text-sm font-medium mb-2">
                    Welcome, {userProfile?.name?.split(" ")[0] || "User"}!
                  </div>
                  <NavLink
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 text-base rounded-lg transition-colors mb-1 ${
                        isActive
                          ? "bg-green-600 text-white font-medium"
                          : "hover:bg-gray-800 hover:text-green-300"
                      }`
                    }
                    to="/profile"
                    role="menuitem"
                  >
                    MY PROFILE
                  </NavLink>
                  <NavLink
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 text-base rounded-lg transition-colors mb-1 ${
                        isActive
                          ? "bg-green-600 text-white font-medium"
                          : "hover:bg-gray-800 hover:text-green-300"
                      }`
                    }
                    to="/orders"
                    role="menuitem"
                  >
                    ORDERS
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="w-full text-left py-3 px-4 text-base rounded-lg hover:bg-gray-800 hover:text-green-300 transition-colors border-t border-gray-700 mt-2"
                    role="menuitem"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `block py-3 px-4 text-base rounded-lg transition-colors text-center font-medium ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`
                  }
                  to="/login"
                  role="menuitem"
                >
                  LOGIN / REGISTER
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {visible && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setVisible(false)}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
