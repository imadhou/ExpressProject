//this function wrappes async functions inside a block with catch for errors
module.exports = (fn) => {
  return (req, resp, next) => {
    fn(req, resp, next).catch(next);
  };
};
