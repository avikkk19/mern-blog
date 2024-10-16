import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPannel = () => {
  const {
    userAuth: { username } , setUserAuth
  } = useContext(UserContext);
  
    const signOut = ()=>{
      removeFromSession("user");
      setUserAuth({acess_token:null})
    }
  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      trasition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border border-grey w-60  duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-sr-file-edit"></i>
          <p>write</p>
        </Link>

        <Link to={`/user/${username}`} className="link pl-8 py-4">
          profile
        </Link>
        <Link to={"/dashboard/blogs"} className="link pl-8 py-4">
          dashboard
        </Link>
        <Link to={"/settings/editprofile"} className="link pl-8 py-4">
          settings
        </Link>
        <span className="absolute border-t border-grey  w-[100%]"></span>

        <button className="text-left p hover:bg-grey w-full pl-8 py-4" onClick={signOut}>
          <h1 className="font-bold text-xl mb-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPannel;
