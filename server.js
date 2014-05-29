var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var dns = require('getIP');
var _ = require('lodash');

var app = express();

var parseURL = require('parseURL');

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
