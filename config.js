var auth = require('./auth');
var default_id = 1;

if (process.argv.length > 2) {
  default_id = process.argv[2];
}

var pin = {};
if (process.platform === 'linux') {
  pin.shtDataPin = 5;
  pin.shtClockPin = 6;
} else if (process.platform === 'tizen') {
} else if (process.platform === 'nuttx') {
} else if (process.platform === 'tizenrt') {
  pin.shtDataPin = 30;
  pin.shtClockPin = 32;
} else {
  throw new Error('Unsupported platform');
}

module.exports = {
  get: function(id) {
    id = id ? id : default_id;

    return {
      id: id,
      pin: pin,
      auth: auth,
      sync: {
        interval: 2000,
      },
    };
  }
};
