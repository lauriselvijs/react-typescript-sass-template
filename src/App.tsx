import React from "react";
import "./App.scss";
import HappyFace from "./assets/happy-face.png";

const App = () => {
  return (
    <div className="app">
      <img src={HappyFace} alt="happy face" className="app__image" />
    </div>
  );
};

export default App;
