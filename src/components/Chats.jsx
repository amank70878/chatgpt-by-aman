import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callChatGtp } from "../utils/callApi";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firebase__db } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import {
  Bars3Icon,
  Cog6ToothIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export const Chats = ({ setSidebarHamburger, currentModel }) => {
  const { chatid } = useParams();
  const user = useSelector(selectUser);
  const scrollTo = useRef();

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [chats, setChats] = useState(null);
  const [settingMenu, setSettingMenu] = useState(false);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    const fetchChat = async () => {
      const __data = await getDocs(
        query(
          collection(
            firebase__db,
            "users",
            user.email,
            "chats",
            chatid,
            "message"
          ),
          orderBy("timestamp", "asc")
        )
      );
      if (__data._snapshot.docs.size > 0) {
        setEmpty(false);
        setChats(
          __data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setLoading(false);
        scrollTo.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      } else {
        setLoading(false);
        setEmpty(true);
      }
    };

    fetchChat();
    return fetchChat;
  }, [user, chatid, input, result, reload]);

  const fetchdata = async (e) => {
    e.preventDefault();
    setInput("");

    await addDoc(
      collection(firebase__db, "users", user.email, "chats", chatid, "message"),
      {
        message: input,
        user__name: user.email,
        timestamp: serverTimestamp(),
      }
    ).catch((err) => console.log(err));

    callChatGtp(input, setResult, chatid, user, setLoading, currentModel);
  };

  const deleteChat = async () => {
    if (chats) {
      const __confirm = window.confirm("are you sure");
      if (__confirm) {
        chats.map(async (__data) => {
          await deleteDoc(
            doc(
              firebase__db,
              "users",
              user.email,
              "chats",
              chatid,
              "message",
              __data.id
            )
          );
        });
        setReload((s) => !s);
      }
    }
  };

  // const [lastID, setLastID] = useState("");

  // const [fetchNewLastID, setFetchNewLastID] = useState(false);
  // useEffect(() => {
  //   const fetchLastId = async () => {
  //     if (fetchNewLastID === true) {
  //       const __data = await getDocs(
  //         query(
  //           collection(
  //             firebase__db,
  //             "users",
  //             user.email,
  //             "chats",
  //             chatid,
  //             "message"
  //           ),
  //           orderBy("timestamp", "asc")
  //         )
  //       );
  //       if (__data._snapshot.docs.size > 0) {
  //         const __length = __data._snapshot.docs.size;
  //         const _id1 = __data.docs[__length - 1].id;
  //         setLastID(_id1);
  //       }
  //     }
  //   };
  //   fetchLastId();
  // }, [fetchNewLastID]);

  // const typeText = async (element, text) => {
  //   let index = 0;
  //   console.log(text.length);

  //   const _element = document.getElementById(element);
  //   console.log(_element);
  //   let interval = setInterval(() => {
  //     if (index < text.length) {
  //       _element.innerHTML += text.charAt(index);
  //       index++;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 200);
  //   console.log("fetched div to write");
  // };

  return (
    <>
      <div className="relative overflow-hidden flex bg-[#343541] text-white flex-col w-[100%] overflow-y-auto ">
        <div className="flex items-center justify-between sm:justify-end p-3">
          <Bars3Icon
            className="w-6 h-6 sm:hidden"
            onClick={() => setSidebarHamburger(true)}
          />
          <Cog6ToothIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSettingMenu((s) => !s)}
          />
        </div>
        <div
          className={`flex items-center justify-center w-fit border border-gray-500 px-5 py-2 rounded-lg hover:bg-gray-500 gap-3 cursor-pointer hover:text-black hover:font-semibold absolute top-12 right-3  ${
            settingMenu ? "settingActive" : "setting"
          }`}
          onClick={() => {
            deleteChat();
            setSettingMenu(false);
          }}
        >
          <TrashIcon className="w-6 h-6 " />
          Delete
        </div>

        <div className="max-h-[94vh] w-full flex-1 overflow-y-auto">
          {loading === true && (
            <div className="flex items-center gap-3 shadow-lg rounded-t-[10px] rounded-bl-[10px]  bg-gray-500 px-5 sm:px-5 py-3 absolute z-10 top-0 sm:right-10 right-3 text-center my-56 sm:text-base text-gray-200">
              chatGPT is thinking....
            </div>
          )}
          {empty ? (
            <div className="w-fit mx-auto flex flex-col items-center justify-center text-xl text-gray-500 capitalize text-center">
              <img
                className="w-[40vh] h-[40vh]"
                src="https://stories.freepiklabs.com/storage/18377/no-data-rafiki-1356.png"
                alt=""
              />
              no data available in this room <br />
              go ahead and ask chatGPT
            </div>
          ) : (
            chats &&
            chats.map(({ user__name, timestamp, message, id }) => {
              return (
                <div
                  key={id}
                  className={`text-lg ${
                    user__name !== user.email && "bg-[#434654]"
                  }  w-full sm:p-3 py-1 text-gray-400`}
                >
                  <div className="flex items-start w-full pl-5 sm:pl-0 lg:w-[70%] 2xl:w-[55%] md:mx-auto">
                    <img
                      className="w-7 h-7 sm:w-14 sm:h-14 object-contain mr-5"
                      src={
                        user__name === user.email
                          ? user.photo
                          : "https://pbs.twimg.com/profile_images/1598924796372422656/nEcoIDXz_400x400.jpg"
                      }
                      alt=""
                    />
                    <div className="flex flex-col w-full">
                      <div className="text-sm sm:text-base">{message}</div>
                      <div className="self-end text-[10px] sm:text-[12px] text-gray-500">
                        {timestamp &&
                          new Date(
                            timestamp.seconds * 1000
                          ).toLocaleDateString() +
                            " " +
                            new Date(
                              timestamp.seconds * 1000
                            ).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={scrollTo} className="h-14 "></div>
        </div>

        <form
          onSubmit={(e) => {
            fetchdata(e);
          }}
          className="flex items-center bg-gray-700/40 text-white justify-center h-[6vh]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here"
            className="flex-1 bg-transparent px-5 py-3 text-gray-300 sm:text-lg text-base border-none outline-none"
          />
          <button
            type="submit"
            onClick={(e) => {
              fetchdata(e);
            }}
            className={`h-full sm:w-56 w-16 ${
              input.length < 1 ? "#1333e9" : "bg-gray-800/40"
            }  sm:text-xl text-base`}
            disabled={input.length < 1}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};
