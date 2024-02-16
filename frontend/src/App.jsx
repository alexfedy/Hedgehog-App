import { useState, useEffect } from "react";
import logo from "./assets/images/hh.png";
// import logo from './assets/images/logo-universal.png';
import "./App.css";
import { StepBackwardOutlined } from "@ant-design/icons";
import Todo from "./Todo";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇"
  );
  const [name, setName] = useState("");
  const updateName = (e) => setName(e.target.value);
  const updateResultText = (result) => setResultText(result);

  const [appState, setAppState] = useState("main");

  useEffect(() => {
    setTimeout(setAppState("todo"), 5000);
  }, []);

  return (
    <div id="App">
      {appState == "todo" ? (
        <>
          <div onClick={() => setAppState("main")}>
            <img src={logo} width={30} height={30} className="right-logo" />
          </div>
          <div className="date-container">
            <span className="today">Today</span>
            <span className="current-date">{new Date().toDateString()}</span>
          </div>
          <Todo />
        </>
      ) : (
        <>
          <img src={logo} id="logo" alt="logo" />
          <div className="home-container">
            <span className="hedgehog">Hedgehog</span>
            <span className="version">v1.0.0</span>
            <button className="startBtn" onClick={() => setAppState("todo")}>
              Back to List
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
