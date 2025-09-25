import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import "../pages/page.css";

export default function Header() {
  const [showLinks, setShowLinks] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const menuRef = useRef(null);

  // Toggle menu visibility
  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLinks(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="flex justify-between items-center bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900  mb-2 shadow-md fixed top-0 left-0 w-full z-50">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-cyan-400 transition duration-300 ease-in-out"
        >
          Palmnazi RC
        </Link>

        {/* Hamburger Menu */}
        <div className="relative">
          <button
            className="focus:outline-none text-white hover:text-cyan-400 transition duration-300 ease-in-out"
            onClick={toggleLinks}
          >
            {showLinks ? (
              // "X" icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Dropdown Menu */}
          {showLinks && (
            <ul
              ref={menuRef}
              className="absolute right-0 top-12 bg-white text-gray-800 rounded-lg shadow-lg py-4 w-60 z-40"
            >
              <Link to="/" onClick={toggleLinks}>
                <li className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors">
                  Home
                </li>
              </Link>
              <Link to="/About" onClick={toggleLinks}>
                <li className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors">
                  About
                </li>
              </Link>
              <Link to="/resortcities" onClick={toggleLinks}>
                <li className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors">
                  Resort Cities
                </li>
              </Link>
              <Link to="/bussinesspage" onClick={toggleLinks}>
                <li className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors">
                  Business
                </li>
              </Link>
              <Link to="/blogspage" onClick={toggleLinks}>
                <li className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors">
                  Blogs
                </li>
              </Link>
              <Link to="/getstarted" onClick={toggleLinks}>
                <li className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors">
                  Sign-in / Sign-up
                </li>
              </Link>

              {/* Show avatar if user is logged in */}
              {currentUser && (
                <Link to="/profile" onClick={toggleLinks}>
                  <li className="px-4 py-2 text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    <img
                      className="rounded-full h-8 w-8 object-cover"
                      src={currentUser.avatar}
                      alt="Profile"
                    />
                    Profile
                  </li>
                </Link>
              )}
            </ul>
          )}
        </div>
      </header>
    </>
  );
}
