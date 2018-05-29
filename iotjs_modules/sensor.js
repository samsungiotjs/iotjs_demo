var gpio = require('gpio') ? require('gpio') : require('./gpio');
var Sht1x = require('sht1x');
var tasker = require('./tasker');

function Sensors(config) {
  this.id = config.id;
  this._inputs = [];

  this.dataPin = gpio.openSync({pin: config.pin.shtDataPin});
  this.clockPin = gpio.openSync({pin: config.pin.shtClockPin});
  this.sht10 = new Sht1x(this.dataPin, this.clockPin);
}

Sensors.prototype.fetch = function(callback) {
  var results = [];

  results.push({
    name: 'temperature' + this.id,
    value: this.sht10.readTemperatureC(),
  });

  results.push({
    name: 'humidity' + this.id,
    value: this.sht10.readHumidity(),
  });

  callback(null, results);
};

function createHandleWithConfig(inputs, config) {
  // this._boundReadFuncList = createHandleWithConfig(this._inputs, config);
  // readAllInputMadeFromConfing(this._boundReadFuncList);

  /*
  sensors: [
        {
          name: 'temperature' + id,
          type: 'gpio',
          dir: 'in',
          pin: 18,
        },
        {
          name: 'humidity' + id,
          type: 'gpio',
          dir: 'in',
          pin: 24,
        },
        {
          name: 'airQuality' + id,
          type: 'gpio',
          dir: 'in',
          pin: 25,
        },
      ],
  */
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
        inputs.push(handle);
      }
    }.bind(this));

    // set 'read' function for inputs
    var boundReadFuncList = createBatchTask(inputs, 'read');
    return boundReadFuncList ;
  }
}

function readAllInputMadeFromConfing(boundReadFuncList) {
  // read all inputs and then invoke the given callback
  tasker.batchRun(boundReadFuncList, function(errors, results) {
    callback(errors, results);
  });
}

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
