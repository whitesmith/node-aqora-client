function list(opts, cb) {
  if (cb === undefined) {
    cb = opts;
    opts = {};
  }

  opts.isAuthRequired = true;
  opts.method = 'GET';
  opts.pathname = '/v1/feeds';

  return this.request(opts, cb);
}

function sendData(feedID, data, opts, cb) {
  if (cb === undefined) {
    cb = opts;
    opts = {};
  }

  opts.body = data;

  opts.isAuthRequired = true;
  opts.method = 'PATCH';
  opts.pathname = '/v1/feeds/' + feedID;

  return this.request(opts, cb);
}

function augment(aqoraClient)
{
  aqoraClient.feeds = {
    list: list.bind(aqoraClient),
    sendData: sendData.bind(aqoraClient)
  };
}

module.exports = augment;
