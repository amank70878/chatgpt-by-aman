import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firebase__db } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import { useNavigate } from "react-router-dom";

export const AddChat = ({ setReload }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const addChat = async () => {
    let __name = prompt("Enter your chat name", "Demo Chat");

    if (__name) {
      await addDoc(collection(firebase__db, "users", user.email, "chats"), {
        chat__name: __name,
        user__id: user.email,
        timestamp: serverTimestamp(),
      })
        .then(async () => {
          const __data = await getDocs(
            query(collection(firebase__db, "users", user.email, "chats"))
          );
          const _id = __data.docs[0].id;
          navigate(`/chats/${_id}`);

          setReload((state) => !state);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <button
        className="flex items-center justify-center md:px-10 py-2 rounded-lg border border-gray-400 text-gray-200 gap-3 hover:bg-[#202130] hover:border-[#202130] text-md mx-auto w-[90%]"
        onClick={() => addChat()}
      >
        <PlusIcon className="h-6 w-6 " />
        Add Chat
      </button>
    </>
  );
};
