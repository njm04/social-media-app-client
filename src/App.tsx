import React from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "@reach/router";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/common/privateRoute";
import Login from "./components/login";
import NewsFeed from "./components/newsFeed";

function App() {
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
        <Login path="/" />
        <PrivateRoute as={NewsFeed} path="/news-feed" />
      </Router>
    </div>
  );
}

export default App;
