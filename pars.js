var serverConfig = require('./server/config/server-config');
var scraper = require('./server/helpers/functions');
var article = require('./server/models/model');
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var url = require('url');


var server = http.createServer(function (request, response) {

    var path = url.parse(request.url).path;

    if (path == '/') {

        article.find({numberOfComments:{$gte:10}}, function(err, articles) {
            if (err) {
                throw err;
            }
            var page = articles.reduce(function (response, item) {

                //if(item.title.search('Гродно') == -1)
                {
                    return response + '<h4>' + '<a href='+ item.id +'>'  + item.title + '</a>' + '</h4>' + 
                        '<small>Комментариев:'+item.numberOfComments+'</small> <hr>';
                }
                //else return response;
            }, '');

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            response.end(page);
        });
    }
    else {

        article.findOne({id: path.replace('/', '')}, function (error, item) {

            if(item != null) {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                response.end('<h3>' + item.title + '</h3>' + item.description);
            }
            else {
                response.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
                response.end('Not found');
            }
        })

    }





});

setInterval(function() {
	    scraper.findNew();
    console.log('loading...');
}, 5000);

server.listen({port: serverConfig.port});

console.log('Server runing on port ' + serverConfig.port);