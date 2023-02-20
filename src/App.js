import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Chats } from "./components/Chats";
import { Main } from "./components/Main";
import { Sidebar } from "./components/Sidebar";
import { firebase__auth } from "./firebaseConfig";
import { Login } from "./page/Login";
import { login, logout, selectUser } from "./store/features/userSlice";
import { ToastContainer } from "react-toast";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [sidebarHamburger, setSidebarHamburger] = useState(false);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");

  useEffect(() => {
    const unSub = firebase__auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            uid: userAuth.uid,
            name: userAuth.displayName,
            email: userAuth.email,
            photo: userAuth.photoURL,
          })
        );
      } else {
        dispatch(logout);
      }
    });

    return unSub;
  }, [dispatch]);
  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <section className="flex overflow-hidden h-screen relative">
          <Sidebar
            sidebarHamburger={sidebarHamburger}
            setSidebarHamburger={setSidebarHamburger}
            setCurrentModel={setCurrentModel}
            currentModel={currentModel}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={<Main setSidebarHamburger={setSidebarHamburger} />}
            />
            <Route
              path="chats/:chatid"
              element={
                <Chats
                  currentModel={currentModel}
                  setSidebarHamburger={setSidebarHamburger}
                />
              }
            />
          </Routes>
          <ToastContainer position="top-right" deplay={600} />
        </section>
      )}
    </>
  );
}

export default App;
