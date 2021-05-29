const mongoose = require('mongoose');

//we create a schema that we will use to model our data
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of the tour is required'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'The price of the tour is required'],
  },
});

//we create a model out of the schema that we've defined
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
