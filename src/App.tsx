import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import PrivateRoute from "./components/common/privateRoute";
import Login from "./components/login";
import NewsFeed from "./components/newsFeed";

function App() {
  return (
    <div className="App">
      <Router>
        <Login path="/" />
        <PrivateRoute as={NewsFeed} path="/news-feed" />
      </Router>
    </div>
  );
}

export default App;
