const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./src/routes/healthRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TransitOps backend is running' });
});

app.use(healthRoutes);
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
