import React from "react";
import SignInFunc from "../utils/SignInFunc";

export const Login = () => {
  return (
    <>
      <section className="bg-[#11A37A] h-screen flex flex-col items-center justify-start pt-20 sm:pt-0 overflow-hidden sm:justify-center">
        <img
          className="sm:w-[500px] sm:h-[500px] object-contain mb-20 sm:mb-10"
          src="./loginBg.png"
          alt=""
        />
        <span
          className="animate-pulse cursor-pointer font-semibold text-white text-3xl"
          onClick={() => SignInFunc()}
        >
          Signin to use ChatGPT
        </span>
      </section>
    </>
  );
};
