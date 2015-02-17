module.exports = function (clients) {

    'use strict';

    /**
     *
     *      CONFIG should return e.g
     *
     *      module.exports.TWITTER = {
     *          key: 'keystring',
     *          secret: 'secretstring',
     *          accessToken: 'accesstokenstring',
     *          tokenSecret: 'tokensecretstring'
     *      }
     *
     *      Config is not in source control for security.
     *
     */

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

    var newSearch = function (nickname, socket) {
        stream.stop();
        searchTweets(nickname,socket);
    };

    var searchTweets = function (nickname, socket) {
        twit.get('search/tweets', { q: nickname }, function (err, reply) {
            if(err) {
                console.log(err);
            }
            console.log('reply', reply)
            console.log('search tweets', nickname)
            stream = twit.stream('statuses/filter', { track: nickname });
            streamTweets(socket);
        });
    };

    var streamTweets = function (socket) { 
        stream.on('tweet', function (data) {
            console.log(data.text)
            var tweet = new Tweet(data);
            socket.broadcast.emit('tweets', tweet);
        });
    };

    return {
        stream: streamTweets,
        searchTweets: searchTweets,
        newSearch: newSearch
    };

};
