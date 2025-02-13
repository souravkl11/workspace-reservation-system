const express = require('express');
const { initializeDatabase } = require('./models/database');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(express.json());

// Initialize database
initializeDatabase().catch(console.error);

// Routes
app.use('/api', userRoutes);
app.use('/api/booking-requests', bookingRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;