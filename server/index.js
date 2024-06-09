const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const errorHandler = require("./utils/errorHandler");
const { specs, swaggerUi } = require("./swagger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // req.body
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/todos", todoRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
