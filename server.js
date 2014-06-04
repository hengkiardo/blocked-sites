'use strict';

var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var Validators = require('validator');
var parseURL = require('node-parse-url');
var allSites = require('./sites');
var getIp = require('./getIP');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var app = express();

app.get('/scraping', function(req, res) {
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
});


app.get('/add', function(req, res) {
    var new_site = req.query.site;
    var dns = require('dns');

    if(Validators.isURL(new_site)) {

        var link = parseURL(new_site);

        var check = _.find(allSites, function(st) {
            return st.host == link.host
        });

        async.waterfall([
            function (callback) {
                dns.resolve4(link.domain, function (err, addresses) {
                    if (err) return false;
                    callback(null, addresses);
                });
            }
        ], function (err, ip) {

            link.ip = ip;

            if(!_.isObject(check)) {
                allSites.push(link);
            }

            fs.writeFileSync('sites.json', JSON.stringify(allSites, null, 4));

            res.send(link);
        });

    } else {
        res.json(505, { error : 'You should add full Url to add new sites'})
    }

})

app.get('/', function(req, res) {
    res.json(200, allSites);
})

app.listen(process.env.PORT || 5566);
exports = module.exports = app;
