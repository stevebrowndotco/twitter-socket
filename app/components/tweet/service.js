module.exports = function (clients) {

    'use strict';

    var CONFIG = require('../../config'),
        twitter = require('twit'),
        Tweet = require('./model.js'),
        stream;

    var twit = new twitter({
        consumer_key: CONFIG.TWITTER.key,
        consumer_secret: CONFIG.TWITTER.secret,
        access_token: CONFIG.TWITTER.accessToken,
        access_token_secret: CONFIG.TWITTER.tokenSecret
    });

    var streamTweets = function (socket) {
        console.log('stream tweets')
        stream.on('tweet', function (data) {
            var tweet = new Tweet(data);
            socket.broadcast.emit('tweets', tweet);
        });
    };

    var searchTweets = function (nickname, socket) {
        console.log('search tweets', nickname)
        twit.get('search/tweets', { q: nickname }, function (err, reply) {
            stream = twit.stream('statuses/filter', { track: nickname });
            streamTweets(socket);
        });
    };

    return {
        stream: streamTweets,
        searchTweets: searchTweets
    };

};