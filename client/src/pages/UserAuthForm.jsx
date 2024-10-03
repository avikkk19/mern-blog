import AnimationWrapper from "../common/AnimationWrapper";
import InputBox from "../components/inputBox";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";

const UserAuthForm = ({ type }) => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "signin" ? "Welcome Back" : "Register Now"}
          </h1>
          {type !== "signin" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="password"
            icon="fi-rr-key"
          />

          <button className=" btn-dark center mt-14 ">
            {type.replace(" ", " $ ")}
          </button>
          <div className=" relative w-full flex items-center gap-2 my-10 opacity-10 upppercase text-black font-bold ">
            <h1 className=" w-1/2 border-black" />
          </div>
          <button
            className=" btn-dark flex  items-center justify-center gap-4
           w-[90%] center"
          >
            <img src={googleIcon} alt="google " className=" w-5 " />
            continue with google
          </button>

          {type === "signin" ? (
            <>
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account?
                <Link
                  to="/signup"
                  className="underline text-black text-xl ml-1"
                >
                  Join Us
                </Link>
              </p>
            </>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign In
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
