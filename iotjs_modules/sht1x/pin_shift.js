var gpio = require('gpio');

var pin_shift = {};

pin_shift.LSBFIRST = 0;
pin_shift.MSBFIRST = 1;

pin_shift.shiftIn =  function(dataPin, clockPin, bitOrder) {
  var value = 0;
  clockPin.setDirectionSync(gpio.DIRECTION.OUT);
  dataPin.setDirectionSync(gpio.DIRECTION.IN);
  for (var i = 0; i < 8; ++i) {
      digitalWrite(clockPin, HIGH);
      if (bitOrder == this.LSBFIRST)
          value |= dataPin.readSync() << i;
      else
          value |= dataPin.readSync() << (7 - i);
      clockPin.writeSync(0);
  }
  return value;
}

pin_shift.shiftOut = function(dataPin, clockPin, bitOrder, val) {
  clockPin.setDirectionSync(gpio.DIRECTION.OUT);
  dataPin.setDirectionSync(gpio.DIRECTION.OUT);

  for (var i = 0; i < 8; i++) {
      if (bitOrder == this.LSBFIRST) {
        dataPin.writeSync(!!(val & (1 << i)));
      } else {
        dataPin.writeSync(!!(val & (1 << (7 - i))));
      }
      clockPin.writeSync(1);
      clockPin.writeSync(0);
  }
}

module.exports = pin_shift;