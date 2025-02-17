import logo from "../imgs/logo.png";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import UserNavigationPannel from "./UserNavigation";
import { useRef } from "react";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPannel, setUserNavPannel] = useState(false);
  const userNavRef = useRef(null); // Ref to track user navigation panel

  const handleUserNavPannel = () => {
    setUserNavPannel((currentVal) => !currentVal);
  };

  const handleClickOutside = (event) => {
    if (userNavRef.current && !userNavRef.current.contains(event.target)) {
      setUserNavPannel(false); // Close user navigation panel if clicked outside of the div
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
          />
          <i className="fi fi-br-search absolute right-[10%] top-1/2 -translate-y-1/2 md:pointer-events-none md:left-5 text-xl text-dark-grey"></i>
        </div>
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="fi fi-br-search text-xl"></i>
          </button>
          <Link className="hidden md:flex gap-2 link" to="/editor">
            <i className="fi fi-sr-file-edit"></i>
            <p>write</p>
          </Link>

          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                </button>
              </Link>

              <div className="relative" ref={userNavRef}>
                <button
                  className="w-12 h-12 mt-1"
                  onClick={handleUserNavPannel}
                >
                  {profile_img ? (
                    <img
                      src={profile_img}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                      No Image
                    </span>
                  )}
                </button>
                {userNavPannel ? <UserNavigationPannel /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                SignIn
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                SignUp
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;