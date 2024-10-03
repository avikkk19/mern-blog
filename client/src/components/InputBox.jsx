import React, { useState } from "react";

const inputBox = ({ name, type, value, placeholder, icon }) => {
  const [passwordVisible, setPasswordVsisible] = useState(false);
  return (
    <div className=" relative w-[100%] mb-4">
      <input
        type={
          type == "password" ? (passwordVisible ? "text" : "password") : type
        }
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        // id={id}
        className="input-box "
      />
      <i className={"fi " + icon + "  input-icon"}></i>
      {type == "password" && (
        <i
          className={
            "fi fi-rr-eye" +
            (!passwordVisible ? "-crossed" : "") +
            " input-icon left-[auto] right-4 cursor-pointer"
          }
          onClick={() => setPasswordVsisible((currentval) => !currentval)}
        ></i>
      )}
    </div>
  );
};

export default inputBox;
