const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const idempotentCheck = require("../middleware/idempotencyCheck");

router.get("/", todoController.getAllTodos);
router.get("/:id", todoController.getTodoById);
router.post("/", idempotentCheck, todoController.createTodo);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;