/* eslint-disable arrow-body-style */
module.exports = (fn) => {
  return (req, resp, next) => {
    fn(req, resp, next).catch(next);
  };
};
