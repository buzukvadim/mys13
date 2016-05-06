    var request = require('request');
    var cheerio = require('cheerio');
    var article = require('../models/model');
    var url = "http://www.s13.ru";

function pushArticle(link, title, summary, id) {

    request.get(link, function (error, response, page) {

        if (response.statusCode == 200) {

            if (!error) {
                var $ = cheerio.load(page);

                var description = $('.item').children('.itemtext').children('p');

                var comments = $('a').children('.commentslink').text();
                var commentsBlock = $('.comments');
                var textNumberOfComments = $(commentsBlock).children('.center').children('h4').children('a').text();
                var numOfComments = parseInt(textNumberOfComments.substr('Комментариев: '.length, textNumberOfComments.length - 'Комментариев: '.length));
                if (isNaN(numOfComments)){
                    numOfComments = 1;
                }
                var new_article = new article({
                    id: id,
                    title: title,
                    summary: summary,
                    description: description,
                    link: link,
                    numberOfComments: numOfComments
                });

                new_article.save(function (error, entry) {
                    if (error)
                    {
                        console.log('Title: ' + title);
                        console.log(error);
                    }
                    else 
                    {
                        console.log(entry.id + entry.title + ' added');
                    }
                });
            }
        }
    });
}

var findNew = function () {
    request.get(url, function (error, response, page) {

        if (response != null && response.statusCode == 200 && !error) {

            if (!error) {
                var $ = cheerio.load(page);

                items = $('div[id*="post"]');

                $(items).each(function (index, item) {

                    var id = $(this).attr('id');

                    article.findOne({id: id}, function (error, flage) {

                        if (error) return console.error(error);

                        if (flage == null) {
                            var title = $(item).children('.itemhead').children('h3').children('a').first().text();
                            var link = $(item).children('.itemhead').children('h3').children('a[rel="bookmark"]').attr('href');
                            var summary = $(item).children('.itemtext').children('p').text();
                            
                            pushArticle(link, title, summary, id);

                        }
                    });
                });

            } else {
                console.log("Error: " + error);
            }
        }
    });
}

module.exports.findNew = findNew;
