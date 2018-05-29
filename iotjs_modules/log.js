var log = function () {
  Array.prototype.unshift.call(
      arguments,
      '['+new Date().toISOString().slice(11,-5)+']'
  );
  return console.log.apply(console, arguments);
};

module.exports = log;
