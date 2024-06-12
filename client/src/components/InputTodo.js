import React, { Fragment, useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    // Check if input fields are empty
    if (!description.trim() || !category.trim()) {
      setErrorMessage("Description and category cannot be empty");
      return;
    }
    // Check if category is either "Work" or "Personal"
    if (category.trim() !== "Work" && category.trim() !== "Personal") {
      setErrorMessage("Category should be either 'Work' or 'Personal'");
      return;
    }
    try {
      const body = { description, category };
      await fetch("http://localhost:5000/todos", {
        method: "POST",
        body: JSON.stringify(body),
      });
      // Reset input fields
      setDescription("");
      setCategory("");
      // Update UI without reloading the page
      // Add logic to update the list of todos as needed
      // Clear the error message
      setErrorMessage("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center">Todo List</h1>
      <form className="d-flex flex-column align-items-center mt-5" onSubmit={onSubmitForm}>
        {/* Display error message if present */}
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