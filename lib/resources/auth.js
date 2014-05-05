function validate(auth, cb) {
  return this.request(auth, "GET", "/v1/auth", null, null, cb);
}

function augment(aqoraClient)
{
  aqoraClient.auth = {
    validate: validate.bind(aqoraClient)
  };
}

module.exports = augment;
