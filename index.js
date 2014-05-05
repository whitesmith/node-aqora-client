var AqoraClient = require("./lib/aqora");

function init (config) {
  var aqora = new AqoraClient(config);
  return aqora;
}

module.exports = init;
