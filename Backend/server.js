const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const fleetRoutes = require('./src/routes/fleetRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TransitOps backend is running' });
});

app.use(healthRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/fleet', fleetRoutes);
app.use('/drivers', driverRoutes);
app.use('/trips', tripRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/expenses', expenseRoutes);
app.use('/reports', reportRoutes);
app.use('/analytics', reportRoutes);
app.use('/settings', settingsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
