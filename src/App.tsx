import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "@reach/router";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/common/privateRoute";
import { loadFriends } from "./store/friends";
import Login from "./components/login";
import NewsFeed from "./components/newsFeed";
import Profile from "./components/profile";
import Root from "./components/root";

function App() {
  const dispatch = useDispatch();

  useEffect((): any => {
    dispatch(loadFriends());
  }, [dispatch]);

  return (
    <div className="App">
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Login path="/login" />
        <PrivateRoute as={Root} path="/">
          <PrivateRoute as={NewsFeed} path="/news-feed" />
          <PrivateRoute as={Profile} path=":name" />
        </PrivateRoute>
      </Router>
    </div>
  );
}

export default App;
