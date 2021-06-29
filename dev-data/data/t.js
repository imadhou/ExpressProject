const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/TourModel');

console.log(process.env.DATABASE);

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
const importd = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importd();
}
