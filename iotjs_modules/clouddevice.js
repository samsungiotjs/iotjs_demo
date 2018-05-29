var https = require('https');
var querystring = require('querystring');


var CloudDevice = function(options) {
  this.deviceID = options.deviceID;
  this.deviceToken = options.deviceToken;
  this.hostname = options.hostname;
  this.userAgent = options.userAgent;
};

function createRESTResHandler(callback) {
  return function(err, data) {
    if (err) {
      callback(err);
    } else if (!data) {
      callback('no data');
    } else {
      var parsed = JSON.parse(data.toString());
      if (parsed.error) {
        callback(parsed.error.message);
      } else {
        callback(null, parsed);
      }
    }
  };
}

CloudDevice.prototype.subscribe = function(path) {
  this.mqtt.subscribe(path);
}

CloudDevice.prototype.post = function(data, callback) {
  var message = JSON.stringify({
    sdid: this.deviceID,
    data: data,
  });

  request({
    hostname: this.hostname,
    method: 'POST',
    path: '/v1.1/messages',
    rejectUnauthorized: false,
    headers: {
      'Content-Length': message.length,
      'Authorization': 'Bearer ' + this.deviceToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': this.userAgent,
    },
  },
  message,
  createRESTResHandler(callback));
};


CloudDevice.prototype.get = function(options, callback) {

  var query = mixin(options, {
    ddid: this.deviceID,
  });

  request({
    hostname: this.hostname,
    method: 'GET',
    path: '/v1.1/actions?' + querystring.encode(query),
    rejectUnauthorized: false,
    headers: {
      'Authorization': 'Bearer ' + this.deviceToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': this.userAgent,
    },
  },
  null,
  createRESTResHandler(callback));
};


function request(options, data, callback) {
  var req = https.request(options, function(res) {
    var responseData = '';

    res.on('data', function(incomming) {
      responseData += incomming.toString();
    });

    res.on('end', function() {
      callback(null, responseData);
    });

    res.on('error', function(err) {
      callback(err);
    });
  })

  if (data) {
    req.end(new Buffer(data));
  } else {
    req.end();
  }
}

function isNullOrUndefined(target) {
  return target === null || target === undefined;
}

function mixin(target) {
  if (isNullOrUndefined(target)) {
    throw new TypeError('target cannot be null or undefined');
  }

  for (var i = 1; i < arguments.length; ++i) {
    var source = arguments[i];
    if (!isNullOrUndefined(source)) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          target[prop] = source[prop];
        }
      }
    }
  }

  return target;
}

module.exports = CloudDevice;
