const pool = require("../config/db");

const idempotentCheck = async (req, res, next) => {
  const { idempotentKey } = req.body;

  if (!idempotentKey) {
    return res.status(400).json({ message: 'Idempotent key is required' });
  }

  try {
    const existingKey = await pool.query("SELECT * FROM idempotent_keys WHERE key = $1", [idempotentKey]);

    if (existingKey.rows.length > 0) {
      return res.status(200).json(existingKey.rows[0].response);
    }

    next();
  } catch (err) {
    console.error("Error checking idempotent key:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = idempotentCheck;