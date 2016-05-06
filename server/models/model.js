const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://127.0.0.1/test')

var article_schema =  new mongoose.Schema({
    id: {type:String, index:{unique:true}},
    summary: String,
    description: String,
    title: String,
    image_url: String,
    link: String,
    numberOfComments:Number,
    createdAt: { type: Date, default: Date.now }
});

const Article = connection.model('Article', article_schema);

module.exports = Article;