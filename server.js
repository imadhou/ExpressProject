const mongoose = require('mongoose');
const dotenv = require('dotenv');
//dotenv is a package that manages environement for nodejs,
//we can specify the env_vars in config.env then using them by calling process
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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
