import "./App.scss";
import happyFace from "./assets/happy-face.png";

const App = () => {
  return (
    <div className="app">
      <img src={happyFace} alt="happy face" />
    </div>
  );
};

export default App;
