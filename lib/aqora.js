var url = require('url');

var request = require('request');

var RECURSION_LIMIT = 3;

function makeRequestOptions(config, opts) {
  var headers = {
    'Content-Type': 'application/json'
  };

  if (opts.auth) {
    headers.Authorization = opts.auth;
  }

  var fullURL = url.format({
    protocol: config.PROTOCOL,
    hostname: config.HOST,
    port: config.PORT,
    pathname: opts.pathname,
    query: opts.query
  });

  var options = {
    headers: headers,
    method: opts.method,
    url: fullURL
  };

  if (opts.body) {
    options.body = JSON.stringify(opts.body);
  }

  return options;
}

/* Constructor */
function AqoraClient(config) {
  this.config = config;

  /* Augment the client with Aqora's different resource methods. */
  require('./resources/auth')(this);
  require('./resources/feeds')(this);
  require('./resources/streams')(this);
}

AqoraClient.prototype.login = function (api_key, api_secret, opts, nCalls, cb) {
  var me = this;

  var basicAuthHeader = 'Basic ' + new Buffer(api_key + ':' + api_secret).toString('base64');

  var loginOpts = {
    method: 'POST',
    pathname: '/v1/auth',
    auth: basicAuthHeader
  };

  return me.request(loginOpts, function (errorResponse, succResponse) {
    if (errorResponse) {
      return cb(errorResponse);
    }

    var bearerAuthHeader = 'Bearer ' + new Buffer(succResponse.data.token).toString('base64');

    /* Store the new Bearer token on the AqoraClient instance. */
    me.authHeader = bearerAuthHeader;

    /* Store it on the original request. */
    opts.auth = me.authHeader;

    /* Redo the original request again, now with a renewed Bearer token. */
    return me.request(opts, nCalls, cb);
  });
}

/* Main method */
AqoraClient.prototype.request = function (opts, nCalls, cb) {
  var me = this;

  if (cb === undefined) {
    cb = nCalls;
    nCalls = 0;
  }

  var hasAPIAuthData = me.config.API_KEY && me.config.API_SECRET;

  /* Populate the options object with the client's Authentication header */
  if (me.authHeader) {
    opts.auth = me.authHeader;
  }

  if (!opts.auth && opts.isAuthRequired) {
    if (!hasAPIAuthData) {
      return cb({
        status: 401,
        message: 'This method requires authentication, but no authentication data was provided.'
      });
    }

    return me.login(me.config.API_KEY, me.config.API_SECRET, opts, nCalls, cb);
  }

  var options = makeRequestOptions(me.config, opts);

  nCalls++;
  return request(options, function (err, res, responseBody) {
    if (err) {
      return cb({
        status: 400,
        message: 'Error while connecting to Aqora.'
      });
    }

    responseBody = JSON.parse(responseBody);

    /* ErrorResponse */
    if (responseBody.status >= 400) {
      /* It may be an expired token.  Try to re-authenticate
       * if authentication data was provided. */
      if (responseBody.status == 403 && hasAPIAuthData && nCalls <= RECURSION_LIMIT) {
        opts.auth = null; /* Forget the expired token. */
        return me.login(me.config.API_KEY, me.config.API_SECRET, opts, nCalls, cb);
      }

      return cb(responseBody);
    }

    /* DataResponse */
    return cb(null, responseBody);
  });
}

module.exports = AqoraClient;
