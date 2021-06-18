/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');

//we create a schema that we will use to model our data
const tourSchema = new mongoose.Schema(
  {
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE})  sould be below price',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// tourSchema.pre('save', function (next) {
//   console.log('doc will be saved');
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

//we create a model out of the schema that we've defined
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
