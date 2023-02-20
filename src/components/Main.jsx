import React from "react";
import {
  Bars3Icon,
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
export const Main = ({ setSidebarHamburger }) => {
  return (
    <>
      <div className="relative flex flex-1 bg-[#343541] text-white flex-col items-center sm:justify-center w-[100%] px-5 overflow-y-auto py-5">
        <div
          className="absolute left-4 sm:hidden"
          onClick={() => setSidebarHamburger(true)}
        >
          <Bars3Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl sm:text-5xl font-semibold tracking-wide pb-10 sm:pb-14">
          ChatGPT
        </h3>

        <div className="flex flex-col items-start sm:flex-row space-y-5 sm:space-y-0 sm:space-x-2">
          {/* examples */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col mb-6 items-center justify-center gap-2">
              <SunIcon className="h-6 w-6 " />
              Examples
            </div>
            <div className="flex flex-col justify-center gap-5">
              <p className="main-p">"Explain Something to me"</p>
              <p className="main-p">
                "What is the difference between a Dog and a Cat"
              </p>
              <p className="main-p">"What is the color of the Sun"</p>
            </div>
          </div>

          {/* capabilities */}
          <div>
            <div className="flex flex-col mb-6 items-center justify-center gap-2">
              <BoltIcon className="h-6 w-6 " />
              Capabilities
            </div>
            <div className="flex flex-col justify-center gap-5">
              <p className="main-p">Change the ChatGPT Modal to use</p>
              <p className="main-p">
                Messages are stored in Firebase's Firestore
              </p>
              <p className="main-p">
                Hot Toast notifications when ChatGTP is thinking!
              </p>
            </div>
          </div>

          {/* limitations */}
          <div>
            <div className="flex flex-col mb-6 items-center justify-center gap-2">
              <ExclamationTriangleIcon className="h-6 w-6 " />
              Limitations
            </div>
            <div className="flex flex-col justify-center gap-5">
              <p className="main-p">
                May occasionally generate incorrect information
              </p>
              <p className="main-p">
                MAy occasionally produce harmful instructions or biassed content
              </p>
              <p className="main-p">
                Limited knowledge of world and events after 2021
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
