const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<Password>',
  process.env.DATABASE_PASSWORD
);

//mongoose is a package that manages the connection to mongodb for us
//when calling connect we have a promess as return
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection for database on');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
