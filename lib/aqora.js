var url = require("url");

var request = require("request");

function makeOptions(config, auth, method, pathname, query, body) {
  var headers = {
    "Content-Type": "application/json"
  };

  if (auth) {
    headers.Authorization = auth;
  }    

  var fullURL = url.format({
    protocol: config.PROTOCOL,
    hostname: config.HOST,
    port: config.PORT,
    pathname: pathname,
    query: query
  });

  var options = {
    headers: headers,
    method: method,
    url: fullURL
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

/* Constructor */
function AqoraClient(config) {
  this.config = config;

  /* Augment the client with Aqora's different resource methods. */
  require("./resources/auth")(this);
  require("./resources/feeds")(this);
  require("./resources/streams")(this);
}

/* Main method */
AqoraClient.prototype.request = function (auth, method, pathname, query, body, cb) {
  var options = makeOptions(this.config, auth, method, pathname, query, body);

  return request(options, function (err, res, body) {
    if (err) {
      return cb({
        status: 400,
        message: "Error while connecting to Aqora."
      });
    }

    body = JSON.parse(body);

    /* ErrorResponse */
    if (body.status >= 400) {
      return cb(body);
    }

    /* DataResponse */
    return cb(null, body);
  });
}

module.exports = AqoraClient;
