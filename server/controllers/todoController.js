const pool = require("../config/db");

// Create a todo
const createTodo = async (req, res) => {
  try {
    const { description, category } = req.body;
    // Insert the new todo, letting PostgreSQL handle the todo_id sequence
    const newTodo = await pool.query(
      "INSERT INTO todos (description, category) VALUES ($1, $2) RETURNING *",
      [description, category]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).send("Server Error");
  }
};

// Get all todos with optional pagination, sorting, filtering, and searching
const getAllTodos = async (req, res) => {
  try {
    let queryStr = "SELECT * FROM todos";
    const queryParams = [];

    const { page = 1, limit = 5, sortBy = 'todo_id', order = 'ASC', search = '', filter = '' } = req.query;

    if (search) {
      queryParams.push(`%${search}%`);
      queryStr += ` WHERE description ILIKE $${queryParams.length}`;
    }

    if (filter) {
      queryParams.push(filter);
      queryStr += (queryParams.length === 1 ? ' WHERE' : ' AND') + ` category = $${queryParams.length}`;
    }

    queryStr += ` ORDER BY ${sortBy} ${order}`;
    queryParams.push(limit, (page - 1) * limit);
    queryStr += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    const allTodos = await pool.query(queryStr, queryParams);
    res.json(allTodos.rows);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific todo
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todos WHERE todo_id = $1", [id]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error("Error fetching todo by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category } = req.body; // Add category from request body
    await pool.query(
      "UPDATE todos SET description = $1, category = $2 WHERE todo_id = $3",
      [description, category, id] // Update parameters to include category
    );
    res.json({ message: "Todo was updated successfully" });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE todo_id = $1", [id]);
    res.json({ message: "Todo was deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
