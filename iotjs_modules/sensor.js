var gpio = require('gpio') ? require('gpio') : require('./gpio');
var tasker = require('./tasker');

function Sensors(config) {
  this._inputs = [];

  // create sensor handles
  if ( Array.isArray(config.sensors) ) {
    config.sensors.forEach(function(item) {
      var name = item.name;
      var dir = item.dir;
      var pin = item.pin;
      var handle;

      switch (item.type) {
        case 'gpio': {
          handle = gpio.open({
            pin: pin,
            mode: gpio.MODE.NONE,
            direction: gpio.DIRECTION.IN,
          }, function(err) {
            if (err) {
              throw err;
            }
           });

          // set name to identify handle
          handle.__name && console.error('__name is alread used');
          handle.__name = name;
        }
        break;
      }

      if (dir == 'in') {
        this._inputs.push(handle);
      }
    }.bind(this));

    // set 'read' function for inputs
    this._boundReadFuncList = createBatchTask(this._inputs, 'read');
  }
}

Sensors.prototype.fetch = function(callback) {
  // read all inputs and then invoke the given callback
  tasker.batchRun(this._boundReadFuncList, function(errors, results) {
    callback(errors, results);
  });
};

function createBatchTask(inputs, funcname) {
  var len = inputs.length;
  var out = [];
  var handle;
  for (var i=0; i<len; i++) {
    handle = inputs[i];
    out.push(new tasker.Task(handle[funcname].bind(handle), handle));
  }
  return out;
}

module.exports = Sensors;
