const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const todos = require('./routes/todoRoutes');
const auth = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', todos);
app.use('/api/auth', auth);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});