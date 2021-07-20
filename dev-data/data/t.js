const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/TourModel');
const Review = require('../../models/ReviewModel');
const User = require('../../models/UserModel');

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

const tours = JSON.parse(fs.readFileSync('.//tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('.//users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('.//reviews.json', 'utf-8'));
const importd = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log('data loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleted = async () => {
  try {
    await Tour.deleteMany();
    console.log('deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importd();
} else if (process.argv[2] === '---delete') {
}
