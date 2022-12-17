module.exports = // A NEW FUNCTION TO HELP CATCH ALL ASYNC FUNCTIONS
  // eslint-disable-next-line arrow-body-style
  (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
