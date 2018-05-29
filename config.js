var default_id = 1;

if (process.argv.length > 2) {
  default_id = process.argv[2];
}

module.exports = {
  get: function(id) {
    id = id ? id : default_id;

    return {
      id: id,
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
      sync: {
        interval: 2000,
      },
      auth: {
        deviceID: '',
        deviceToken: '',
        userID: '',
        hostname: 'api.artik.cloud',
        userAgent: 'iotjs/1.0',
      },
    };
  }
};
