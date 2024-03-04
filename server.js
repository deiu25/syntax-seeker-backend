import dotenv from "dotenv";
import connectDatabase from './config/database.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// Connecting to database
connectDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`ERROR: ${err.stack}`);
      console.error('Shutting down the server due to Unhandled Promise rejection');
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((error) => {
    console.error(`Could not connect to database: ${error}`);
  });