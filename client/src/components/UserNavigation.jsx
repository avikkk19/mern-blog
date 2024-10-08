import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";

const UserNavigationPannel = () => {
  return (
    <AnimationWrapper trasition={{ duration: 0.2 }}>
      <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-sr-file-edit"></i>
          <p>write</p>
        </Link>

        <Link to={``}></Link>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPannel;
