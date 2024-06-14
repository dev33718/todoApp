const pool = require("../config/db");

const idempotentCheck = async (req, res, next) => {
  const idempotentKey = req.headers['Idempotency-Key'];
  if (!idempotentKey) {
    return res.status(400).json({ message: 'Idempotency-Key header is missing' });
  }

  try {
    const result = await pool.query('SELECT response FROM idempotent_keys WHERE key = $1', [idempotentKey]);
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0].response);
    }

    next();
  } catch (err) {
    console.error('Error checking idempotency key:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = idempotentCheck;
