const fs = require('fs');
const express = require('express');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const app = express();
const port = 3000;

app.use(express.json());

const getAllTours = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, resp) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return resp.status(404).send({
      status: 'fail',
      message: 'Not found',
    });
  }
  resp.status(200).json({
    status: 'success',
    results: 1,
    data: {
      tour,
    },
  });
};

const creatTour = (req, resp) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/dev/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log(tours);
      resp.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.get('/api/v1/tours/:id');

app.route('/api/v1/tours').get(getAllTours).post(creatTour);
app.route('/api/v1/tours/:id').get(getTourById);
