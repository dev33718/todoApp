import React from "react";
import "./styles.css";
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";

function App() {
  return (
    <div className="container">
      <InputTodo />
      <ListTodos />
    </div>
  );
}

export default App;
