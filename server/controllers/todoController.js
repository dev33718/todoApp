const pool = require("../config/db");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: 'OAUTH2',
    user: config.EMAIL_USER,
    accessToken: config.ACCESS_TOKEN
  },
});

// Create a todo
const createTodo = async (req, res) => {
  try {
    const { description, category } = req.body;
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

// Register route
const register = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user is already registered
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send('User already registered. Please log in.');
    }

    // Generate a token
    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });

    // Insert the user into the database
    await pool.query("INSERT INTO users (email, token) VALUES ($1, $2)", [email, token]);

    // Send email with registration link
    const link = `${config.FRONTEND_URL}/dashboard?token=${token}`;
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Registration Confirmation',
      text: `You are registered. Click on the link to complete the registration: ${link}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: 'Error sending email' });
      }
      // Redirect to login screen
      res.status(200).json({ message: 'Registered successfully. Please log in.' });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Server Error");
  }
};

// Login route
const login = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user is registered
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length === 0) {
      return res.status(400).send('User not registered. Please register first.');
    }

    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });
    await pool.query("UPDATE users SET token = $1 WHERE email = $2", [token, email]);

    const link = `${config.FRONTEND_URL}/dashboard?token=${token}`;

    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Magic Link for Login',
      text: `Click on the link to login: ${link}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(200).json({ message: 'Login email sent', token });
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Validate route
const validate = async (req, res) => {
  try {
    const { token } = req.query;

    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded) {
      // Token is valid
      res.status(200).json({ message: 'Token is valid' });
    } else {
      // Token is invalid
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    console.error("Error validating token:", err);
    res.status(500).json({ error: 'Internal Server Error' }); // Send JSON response for other errors
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify the token to extract the email
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const email = decoded.email;

    // Generate a new token for the user
    const newToken = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });

    // Update the user's token with the new one
    await pool.query("UPDATE users SET token = $1 WHERE email = $2", [newToken, email]);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  register,
  login,
  validate,
  logout
};