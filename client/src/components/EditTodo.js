import React, { Fragment, useState } from "react";

const EditTodo = ({ todo, updateTodoInState }) => {
  const [description, setDescription] = useState(todo.description);
  const [category, setCategory] = useState(todo.category);
  const [initialValues, setInitialValues] = useState({ description: todo.description, category: todo.category });

  const updateDescription = async (e) => {
    e.preventDefault();
    if (!description.trim() || !category.trim()) {
      alert("Description and category cannot be empty");
      return;
    }
    if (category.trim() !== "Work" && category.trim() !== "Personal") {
      alert("Category should be either 'Work' or 'Personal'");
      return;
    }
    try {
      const body = { description, category };
      const response = await fetch(
        `http://localhost:5000/todos/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const updatedTodo = { ...todo, description, category };
        updateTodoInState(updatedTodo);
      } else {
        alert("Failed to update todo");
      }
    } catch (err) {
      console.error(err.message);
      alert("Failed to update todo");
    }
  };

  const resetValues = () => {
    setDescription(initialValues.description);
    setCategory(initialValues.category);
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
        aria-label="Edit Todo"
        onClick={() => setInitialValues({ description, category })}
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${todo.todo_id}`}
        onClick={(e) => {
          if (e.target.className === 'modal') {
            resetValues();
          }
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Todo</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={resetValues}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter a todo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Enter a category (Work/Personal)..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => updateDescription(e)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={resetValues}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditTodo;