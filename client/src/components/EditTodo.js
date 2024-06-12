import React, { Fragment, useState } from "react";

const EditTodo = ({ todo, updateTodoInState }) => {
  const [description, setDescription] = useState(todo.description);
  const [category, setCategory] = useState(todo.category);

  const updateDescription = async (e) => {
    e.preventDefault();
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
        console.error("Failed to update todo");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
        aria-label="Edit Todo"
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${todo.todo_id}`}
        onClick={() => {
          setDescription(todo.description);
          setCategory(todo.category);
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
                onClick={() => {
                  setDescription(todo.description);
                  setCategory(todo.category);
                }}
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
                placeholder="Enter a category..."
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
                onClick={() => {
                  setDescription(todo.description);
                  setCategory(todo.category);
                }}
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
