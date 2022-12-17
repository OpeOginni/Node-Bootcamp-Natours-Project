const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! Shitting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Conecting To MongoDB...This is perfect for Version ^6
const DB = process.env.DATABASE;

mongoose.set('strictQuery', true);

async function dbConnect() {
  await mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful'));
}

dbConnect(); //.catch((err) => console.log(err));

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// Handling Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
