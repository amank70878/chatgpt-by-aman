import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { firebase__auth, firebase__db } from "../firebaseConfig";
import { selectUser } from "../store/features/userSlice";
import { AddChat } from "./AddChat";
import { AllModels } from "./AllModels";

export const Sidebar = ({
  setSidebarHamburger,
  sidebarHamburger,
  currentModel,
  setCurrentModel,
}) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { photo } = user;

  const [chats, setChats] = useState(null);
  const [ids, setIds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [reload, setReload] = useState(false);
  const [deleteID, setDeleteID] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      const __data = await getDocs(
        query(collection(firebase__db, "users", user.email, "chats"))
      );

      if (__data._snapshot.docs.size > 0) {
        setChats(
          __data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setLoading(false);
      } else {
        setLoading(false);
        setEmpty(true);
      }
    };
    fetchChat();

    return fetchChat;
  }, [user, loading, reload]);

  const deleteChat = async (id) => {
    const confirm = window.confirm("are you sure ?");

    if (confirm) {
      await deleteDoc(doc(firebase__db, "users", user.email, "chats", id));
      setDeleteID(id);

      const __data = await getDocs(
        query(
          collection(firebase__db, "users", user.email, "chats", id, "message")
        )
      );

      if (__data._snapshot.docs.size > 0) {
        setIds(
          __data.docs.map((doc) => ({
            id: doc.id,
          }))
        );
      }

      setLoading(true);
      setReload((a) => !a);
    }
  };

  useEffect(() => {
    if (ids) {
      ids.map(async (__data) => {
        await deleteDoc(
          doc(
            firebase__db,
            "users",
            user.email,
            "chats",
            deleteID,
            "message",
            __data.id
          )
        );
      });

      navigate("/");
    }
  }, [ids, deleteID, navigate, user.email]);

  return (
    <section
      className={`flex sm:relative sm:left-0 md:min-w-[300px] flex-col px-5 py-5 bg-[#202123] text-white 
      ${sidebarHamburger ? "sidehamger" : "notsidehamburger"}`}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between px-2 pb-6 sm:hidden ">
          <p className="text-lg">chatGPT</p>
          <XMarkIcon
            className="w-7 h-7"
            onClick={() => setSidebarHamburger(false)}
          />
        </div>
        <AddChat setReload={setReload} />
        <AllModels
          setCurrentModel={setCurrentModel}
          currentModel={currentModel}
        />

        <div className="flex flex-col items-center space-y-3  overflow-y-auto h-[71vh] mt-10 ">
          {loading ? (
            <div className="text-center my-10 text-lg capitalize text-gray-400">
              fetching {user.name} chats....
            </div>
          ) : empty ? (
            <div className="text-center my-10 text-lg capitalize text-gray-400">
              no chats
            </div>
          ) : (
            chats &&
            chats.map(({ id, user__id, timestamp, chat__name }) => {
              return (
                <Link
                  to={`/chats/${id}`}
                  onClick={() => {
                    setSidebarHamburger(false);
                  }}
                  key={id}
                  className="text-gray-400 hover:bg-[#2c2d2f] border border-[#2c2d2f] cursor-pointer flex w-full items-center justify-between space-x-4 px-5 py-3 rounded-xl "
                >
                  <ChatBubbleLeftIcon className="w-6 h-6 " />
                  <p>{chat__name}</p>
                  <TrashIcon
                    className="w-6 h-6 hover:text-red-400 hover:scale-150 cursor-pointer"
                    onClick={() => deleteChat(id)}
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>
      <img
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full mx-auto hover:opacity-80 cursor-pointer"
        onClick={() => {
          firebase__auth.signOut();
          window.location.reload();
        }}
        alt="user"
        src={photo}
      />
    </section>
  );
};
