import React, { Fragment, useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim() || !category.trim()) {
      setErrorMessage("Description and category cannot be empty");
      return;
    }
    if (category.trim() !== "Work" && category.trim() !== "Personal") {
      setErrorMessage("Category should be either 'Work' or 'Personal'");
      return;
    }
    try {
      const body = { description, category };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        setDescription("");
        setCategory("");
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error adding todo");
      }
    } catch (err) {
      console.error(err.message);
      setErrorMessage("Error adding todo");
    }
  };

  return (
    <Fragment>
      <h1 className="text-center">Todo List</h1>
      <form className="d-flex flex-column align-items-center mt-5" onSubmit={onSubmitForm}>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter a todo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter a category (Work/Personal)..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-success">Add</button>
      </form>
    </Fragment>
  );
};

export default InputTodo;