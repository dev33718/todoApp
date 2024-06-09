const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Retrieve a list of todos
 *     description: Retrieve a list of todos with optional pagination, sorting, filtering, and searching
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., todo_id, description, category)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Sort order (ASC or DESC)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query to filter todos by description
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter todos by category (Work or Personal)
 *     responses:
 *       '200':
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       '500':
 *         description: Internal Server Error
 */
router.get("/", todoController.getAllTodos);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Retrieve a single todo by ID
 *     description: Retrieve a single todo by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the todo to retrieve
 *     responses:
 *       '200':
 *         description: A single todo object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal Server Error
 */
router.get("/:id", todoController.getTodoById);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo with the provided description and category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTodo'
 *     responses:
 *       '201':
 *         description: A new todo object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       '400':
 *         description: Bad request (e.g., missing request body)
 *       '500':
 *         description: Internal Server Error
 */
router.post("/", todoController.createTodo);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update an existing todo
 *     description: Update an existing todo with the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the todo to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodo'
 *     responses:
 *       '200':
 *         description: Todo was updated successfully
 *       '400':
 *         description: Bad request (e.g., missing request body)
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal Server Error
 */
router.put("/:id", todoController.updateTodo);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Delete a todo with the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the todo to delete
 *     responses:
 *       '200':
 *         description: Todo was deleted successfully
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete("/:id", todoController.deleteTodo);

module.exports = router;