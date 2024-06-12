const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

router.post('/login', todoController.login);
router.post('/register', todoController.register);
router.get('/validate', todoController.validate);
router.post('/logout', todoController.logout);

module.exports = router;