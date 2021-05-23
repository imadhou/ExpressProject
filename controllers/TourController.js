const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, resp, next, val) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return resp.status(404).send({
      status: 'fail',
      message: 'Not found',
    });
  }
  next();
};

exports.getAllTours = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    reqwestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, resp) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  resp.status(200).json({
    status: 'success',
    results: 1,
    data: {
      tour,
    },
  });
};

exports.createTour = (req, resp) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/dev/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      resp.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

exports.checkPost = (req, resp, next) => {
  if (
    !req.body ||
    !req.body.name ||
    !req.body.duration ||
    !req.body.difficulty
  ) {
    return resp.status(404).json({
      status: 'Error',
      message: 'The body should be set!',
    });
  }
  next();
};
