function validate(opts, cb) {
  if (cb === undefined) {
    cb = opts;
    opts = {};
  }

  opts.isAuthRequired = true;
  opts.method = 'GET';
  opts.pathname = '/v1/auth';

  return this.request(opts, cb);
}

function augment(aqoraClient)
{
  aqoraClient.auth = {
    validate: validate.bind(aqoraClient)
  };
}

module.exports = augment;
