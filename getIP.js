var dns = require('dns');

exports.getIP = function getIP(domain) {
  dns.resolve4(domain, function (err, addresses) {
    if (err) return false;
    return addresses
  });
}
