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

    var twitter = require('twit'),
        Tweet = require('./model.js'),
        stream;

    var twit = new twitter({
        consumer_key: CONFIG.TWITTER.key,
        consumer_secret: CONFIG.TWITTER.secret,
        access_token: CONFIG.TWITTER.accessToken,
        access_token_secret: CONFIG.TWITTER.tokenSecret
    });

    var searchTweets = function (nickname, socket) {

        if(stream) {
            stream.stop();
        }

        stream = twit.stream('statuses/filter', { track: nickname });
        stream.on('tweet', function (data) {
            console.log(data.text)
            var tweet = new Tweet(data);
            socket.broadcast.emit('tweets', tweet);
        });

    };

    return {
        stream: searchTweets,
        searchTweets: searchTweets
    };

};
