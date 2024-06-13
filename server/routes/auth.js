const express = require("express");
const router = express.Router();
const authController = require("../controllers/todoController");
const idempotentCheck = require("../middleware/idempotencyCheck");

router.post('/login', idempotentCheck, authController.login);
router.post('/register', idempotentCheck, authController.register);
router.get('/validate', authController.validate);
router.post('/logout', idempotentCheck, authController.logout);

module.exports = router;