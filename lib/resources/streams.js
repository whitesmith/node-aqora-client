function list(feedID, opts, cb) {
  if (cb === undefined) {
    cb = opts;
    opts = {};
  }

  opts.isAuthRequired = true;
  opts.method = 'GET';
  opts.pathname = '/v1/feeds/' + feedID + '/streams';

  return this.request(opts, cb);
}

function getData(feedID, streamName, query, opts, cb) {
  if (cb === undefined) {
    cb = opts;
    opts = {};
  }

  opts.isAuthRequired = true;
  opts.method = 'GET';
  opts.pathname = '/v1/feeds/' + feedID + '/streams/' + streamName;

  if (query !== null) {
    opts.query = query;
  }

  return this.request(opts, cb);
}

function augment(aqoraClient)
{
  aqoraClient.streams = {
    list: list.bind(aqoraClient),
    getData: getData.bind(aqoraClient)
  };
}

module.exports = augment;
