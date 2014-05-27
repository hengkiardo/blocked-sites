var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var dns = require('getIP');
var _ = require('lodash');

var app = express();

var parseURL = function parseURL (url) {
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url;

    protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    remaining_url = url.substr(protocol_i + 3, url.length);
    domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length ){
        case 2:
          parsed_url.subdomain = null;
          parsed_url.host = domain_parts[0];
          parsed_url.tld = domain_parts[1];
          break;
        case 3:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}

app.get('/', function(req, res) {
    var links = [];

    async.waterfall([
        function (callback) {
            request('http://theporndude.com/', function(error, response, html) {
                var $ = cheerio.load(html);

                var alink = $('a.link');

                alink.each(function( index ) {

                    var href = $(this).attr('href');
                    var link = parseURL(href);

                    if( links.length > 0 && link != 'undefined') {

                        var check = _.find(links, function(lk) {
                            return lk.host == link.host
                        })

                        if(!_.isObject(check)) {
                            links.push(link);
                        }
                    } else {
                        links.push(link);
                    }

                });
                callback(null, links)
            })
        },
        function (links, callback) {
            request('http://mypornbible.com/', function(error, response, html) {
                var $ = cheerio.load(html);

                var alink = $('li a.link');

                alink.each(function( index ) {
                    var href = $(this).attr('href');
                    var link = parseURL(href);

                    if( links.length > 0 && link != 'undefined') {

                        var check = _.find(links, function(lk) {
                            return lk.host == link.host
                        })

                        if(!_.isObject(check)) {
                            links.push(link);
                        }
                    } else {
                        links.push(link);
                    }
                });
                callback(links)
            })
        }
    ], function ( links) {
        res.send(links);
        fs.writeFileSync('sites.json', JSON.stringify(links, null, 4));
    });
})

app.listen('8081')
exports = module.exports = app;
