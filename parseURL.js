(function(module) {
  'use strict';

  var Url = require('url');

  module.exports = function parseURL(url) {

      var parsed_url = Url.parse(url);

      var domain_parts = parsed_url.hostname.split('.');

      switch ( domain_parts.length ){
          case 2:
            parsed_url.subdomain = null;
            parsed_url.host = domain_parts[0];
            parsed_url.tld = domain_parts[1];
            parsed_url.domain = domain_parts[0] + '.' + domain_parts[1];
            break;
          case 3:
            parsed_url.subdomain = domain_parts[0];
            parsed_url.host = domain_parts[1];
            parsed_url.tld = domain_parts[2];
            parsed_url.domain = domain_parts[1] + '.' + domain_parts[2];
            break;
          case 4:
            parsed_url.subdomain = domain_parts[0];
            parsed_url.host = domain_parts[1];
            parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
            break;
      }

      delete parsed_url.auth;
      delete parsed_url.search;
      delete parsed_url.query;
      delete parsed_url.href;
      delete parsed_url.hash;
      delete parsed_url.slashes;
      delete parsed_url.pathname;

      return parsed_url
  }
})(module);
