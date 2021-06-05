const mongoose = require('mongoose');

//we create a schema that we will use to model our data
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of the tour is required'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'The duration of the tour is required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'The group size of the tour is required'],
  },
  difficulty: {
    type: String,
    required: [true, 'The difficulty of the tour is required'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'The price of the tour is required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'The description is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'The cover image is required'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

//we create a model out of the schema that we've defined
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
