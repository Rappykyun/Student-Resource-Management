/**
 * Wraps an async function and catches any errors, passing them to the next middleware
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Express middleware function
 */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}; 