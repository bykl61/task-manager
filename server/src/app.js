import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongooseConnection from './config/mongodb.js';
import sequelize from './config/mysql.js';
import redisClient from './config/redis.js';
import router from './routes/index.js';
import taskAgenda from './agenda/taskAgenda.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connections
const initializeServices = async () => {
  try {
    // MongoDB
    await mongooseConnection();
    console.log('MongoDB connected');

    // MySQL
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('MySQL connected');

    // Redis
    await redisClient.connect();
    console.log('Redis connected');

    await taskAgenda.init();

    console.log('Task scheduler started');

  } catch (error) {
    console.error('Service initialization error:', error);
    process.exit(1);
  }
};
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', router);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeServices();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
};

startServer();