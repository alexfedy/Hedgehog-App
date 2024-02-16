import { useState, useEffect } from "react";
// import logo from "./assets/images/hh.png";
import { AnimatePresence, motion } from "framer-motion";
import {
  DeleteOutlined,
  VerticalAlignTopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import "./App.css";
import { LoadFile } from "../wailsjs/go/main/App.js";
import { DeleteTask } from "../wailsjs/go/main/App.js";
import { AppendTasksToFile } from "../wailsjs/go/main/App.js";
import { UpdateTaskStatus } from "../wailsjs/go/main/App.js";
import { SortTasks } from "../wailsjs/go/main/App.js";
import { ClearTaskList } from "../wailsjs/go/main/App.js";

const MAX_CHARS = 70;

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  useEffect(() => {
    load_tasks();
  }, [tasks]);

  const clearTasks = (e) => {
    e.preventDefault();
    ClearTaskList().then((result) => load_tasks());
  };

  const sortTasks = (e) => {
    e.preventDefault();
    SortTasks().then((result) => load_tasks());
  };

  const updateTaskStatus = (e, taskid) => {
    e.preventDefault();
    UpdateTaskStatus(taskid).then((result) => load_tasks());
  };

  const deleteTask = (e, taskid) => {
    e.preventDefault();
    DeleteTask(taskid).then((result) => load_tasks());
  };

  const addTask = (e) => {
    e.preventDefault();
    let task = newTask;
    if (task.trim() == "") {
      return;
    }
    if (task.length >= MAX_CHARS - 1) {
      task += "...";
    }
    AppendTasksToFile(task).then((result) => load_tasks());
    setNewTask((prev) => "");
    document.activeElement.blur();
    setFocused((prev) => !prev);
  };

  const handleTaskInput = (e) => {
    if (e.target.value.length >= MAX_CHARS) {
      return;
    }
    setNewTask((prev) => e.target.value);
  };

  function load_tasks() {
    // LoadTasks().then((result) => setTasks(result));
    LoadFile().then((result) => setTasks(JSON.parse(result)));
  }

  return (
    <div id="Todo">
      <div className="Todo todo-list-container">
        {/* <div className="horizonal-container">
          <div onClick={(e) => sortTasks(e)}>
            <VerticalAlignTopOutlined />
          </div>
        </div> */}
        <div className="input-cont">
          <input
            className="task-input"
            type="text"
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Create Task..."
            value={newTask}
            style={{ outline: "none", border: "none", fontSize: "14px" }}
            onChange={(e) => handleTaskInput(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask(e);
              }
            }}
          />
        </div>
      </div>

      {tasks && tasks.length > 0 && (
        <motion.div
          key={tasks}
          className="Todo todo-list-container"
          initial={{ y: -10, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {tasks.map((task, i) => (
            <div key={i} className="task-item">
              <div className="item-left">
                <div>
                  {task.status == 0 ? (
                    <div onClick={(event) => updateTaskStatus(event, task.id)}>
                      <div className="in-progress"></div>
                    </div>
                  ) : (
                    <div
                      className="done"
                      onClick={(event) => updateTaskStatus(event, task.id)}
                    >
                      <CheckOutlined
                        style={{
                          fontSize: "15px",
                          color: "white",
                          position: "absolute",
                          top: 5,
                          left: 2.5,
                        }}
                      />
                    </div>
                  )}
                </div>
                {/* <span>{task.status}</span> */}
                {task.status == 1 ? (
                  <span>
                    <s>{task.title}</s>
                  </span>
                ) : (
                  <span disabled="disabled">{task.title}</span>
                )}
              </div>
              <div
                onClick={(e) => {
                  deleteTask(e, task.id);
                }}
              >
                <DeleteOutlined style={{ fontSize: "18px", color: "grey" }} />
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Todo;
