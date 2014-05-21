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

function augment(aqoraClient)
{
  aqoraClient.feeds = {
    list: list.bind(aqoraClient)
  };
}

module.exports = augment;
