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

const storeIdempotentKeyResponse = async (key, response) => {
  try {
    await pool.query(
      "INSERT INTO idempotent_keys (key, response) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET response = EXCLUDED.response",
      [key, response]
    );
  } catch (err) {
    console.error("Error storing idempotent key response:", err);
  }
};

// Function to check if idempotent key exists
const checkIdempotentKey = async (key) => {
  const result = await pool.query("SELECT * FROM idempotent_keys WHERE key = $1", [key]);
  return result.rows.length > 0;
};

// Create a todo
const createTodo = async (req, res) => {
  try {
    const { description, category, idempotentKey } = req.body;
    if (!description || !category) {
      return res.status(400).json({ message: 'Description and category are required' });
    }

    const keyExists = await checkIdempotentKey(idempotentKey);
    if (keyExists) {
      return res.status(409).json({ message: 'Duplicate request' });
    }

    const newTodo = await pool.query(
      "INSERT INTO todos (description, category) VALUES ($1, $2) RETURNING *",
      [description, category]
    );

    const response = newTodo.rows[0];

    await storeIdempotentKeyResponse(idempotentKey, response);

    res.status(201).json(response);
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
    if (todo.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
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
    const { description, category } = req.body;
    if (!description || !category) {
      return res.status(400).json({ message: 'Description and category are required' });
    }
    if (category !== "Work" && category !== "Personal") {
      return res.status(400).json({ message: "Category should be either 'Work' or 'Personal'" });
    }
    await pool.query(
      "UPDATE todos SET description = $1, category = $2 WHERE todo_id = $3",
      [description, category, id]
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
    const deletedTodo = await pool.query("DELETE FROM todos WHERE todo_id = $1 RETURNING *", [id]);
    if (deletedTodo.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: "Todo was deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Register route
const register = async (req, res) => {
  try {
    const { email, idempotentKey } = req.body;
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already registered. Please log in.' });
    }

    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });

    await pool.query('INSERT INTO users (email, token) VALUES ($1, $2)', [email, token]);

    const link = `${config.FRONTEND_URL}/dashboard?token=${token}`;
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Registration Confirmation',
      text: `You are registered. Click on the link to complete the registration: ${link}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      const response = { message: 'Registered successfully. Please check your email.' };
      storeIdempotentKeyResponse(idempotentKey, response);
      res.status(200).json(response);
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login route
const login = async (req, res) => {
  try {
    const { email } = req.body;
    const idempotentKey = req.headers['idempotency-key'];

    // Check if the idempotency key exists
    const existingKey = await pool.query('SELECT * FROM idempotent_keys WHERE key = $1', [idempotentKey]);
    if (existingKey.rows.length > 0) {
      // Return the stored response if the key exists
      return res.status(200).json({ message: 'Login email already sent. Please check your email.', response: existingKey.rows[0].response });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length === 0) {
      return res.status(400).json({ message: 'User not registered. Please register first.' });
    }

    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });

    await pool.query('UPDATE users SET token = $1 WHERE email = $2', [token, email]);

    const link = `${config.FRONTEND_URL}/dashboard?token=${token}`;
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Magic Link for Login',
      text: `Click on the link to login: ${link}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }

      const response = { message: 'Login email sent', token };

      await storeIdempotentKeyResponse(idempotentKey, response);

      res.status(200).json(response);
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Validate route
const validate = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const result = await pool.query('SELECT * FROM users WHERE token = $1', [token]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded) {
      res.status(200).json({ message: 'Token is valid' });
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    console.error("Error validating token:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Logout route
const logout = async (req, res) => {
  try {
    const { token, idempotentKey } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const email = decoded.email;

    const newToken = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });

    await pool.query("UPDATE users SET token = $1 WHERE email = $2", [newToken, email]);

    const response = { message: 'Logged out successfully' };
    storeIdempotentKeyResponse(idempotentKey, response);
    res.status(200).json(response);
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
