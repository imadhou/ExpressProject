const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./models/TourModel');
const Review = require('./models/ReviewModel');
const User = require('./models/UserModel');

dotenv.config({ path: './config.env' });

console.log(process.env.NODE_ENV, 'ebnv');

const DB = process.env.DATABASE.replace(
  '<Password>',
  process.env.DATABASE_PASSWORD
);

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

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);

const importd = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('data loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleted = async () => {
  try {
    console.log('here');

    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importd();
} else if (process.argv[2] === '--delete') {
  deleted();
}
