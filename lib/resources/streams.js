function list(auth, feedID, cb) {
  return this.request(auth, "GET", "/v1/feeds/" + feedID + "/streams", null, null, cb);
}

function getData(auth, feedID, streamName, query, cb) {
  return this.request(auth, "GET", "/v1/feeds/" + feedID + "/streams/" + streamName, query, null, cb);
}

function augment(aqoraClient)
{
  aqoraClient.streams = {
    list: list.bind(aqoraClient),
    getData: getData.bind(aqoraClient)
  };
}

module.exports = augment;
