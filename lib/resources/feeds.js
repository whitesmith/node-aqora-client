function list(auth, cb) {
  return this.request(auth, "GET", "/v1/feeds", null, null, cb);
}

function augment(aqoraClient)
{
  aqoraClient.feeds = {
    list: list.bind(aqoraClient)
  };
}

module.exports = augment;
