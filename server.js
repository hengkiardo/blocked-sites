'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var dns = require('getIP');
var _ = require('lodash');
var Validators = require('validator');

var allSites = require('sites');

var app = express();

var parseURL = require('parseURL');

// app.get('/scraping', function(req, res) {
//     var links = [];

//     async.waterfall([
//         function (callback) {
//             request('http://theporndude.com/', function(error, response, html) {
//                 var $ = cheerio.load(html);

//                 var alink = $('a.link');

//                 alink.each(function( index ) {

//                     var href = $(this).attr('href');
//                     var link = parseURL(href);

//                     if( links.length > 0 && link != 'undefined') {

//                         var check = _.find(links, function(lk) {
//                             return lk.host == link.host
//                         })

//                         if(!_.isObject(check)) {
//                             links.push(link);
//                         }
//                     } else {
//                         links.push(link);
//                     }

//                 });
//                 callback(null, links)
//             })
//         },
//         function (links, callback) {
//             request('http://mypornbible.com/', function(error, response, html) {
//                 var $ = cheerio.load(html);

//                 var alink = $('li a.link');

//                 alink.each(function( index ) {
//                     var href = $(this).attr('href');
//                     var link = parseURL(href);

//                     if( links.length > 0 && link != 'undefined') {

//                         var check = _.find(links, function(lk) {
//                             return lk.host == link.host
//                         })

//                         if(!_.isObject(check)) {
//                             links.push(link);
//                         }
//                     } else {
//                         links.push(link);
//                     }
//                 });
//                 callback(links)
//             })
//         }
//     ], function ( links) {
//         res.send(links);
//         fs.writeFileSync('sites.json', JSON.stringify(links, null, 4));
//     });
// });


app.get('/add', function(req, res) {
    var new_site = req.query.site;

    if(Validators.isURL(new_site)) {

        var link = parseURL(new_site);

        var check = _.find(allSites, function(st) {
            return st.host == link.host
        })


        if(!_.isObject(check)) {
            allSites.push(link);
        }

        fs.writeFileSync('sites.json', JSON.stringify(allSites, null, 4));

        res.send(link);
    } else {
        res.json(505, { error : 'You should add full Url to add new sites'})
    }

})

app.get('/', function(req, res) {
    res.json(200, allSites);
})

app.listen('8081')
exports = module.exports = app;
