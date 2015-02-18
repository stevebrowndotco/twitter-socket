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

    var TWITTER_CONFIG = {};

    if (process.env.TWITTER_KEY) {

        TWITTER_CONFIG = {
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_SECRET,
            access_token: process.env.ACCESS_TOKEN,
            access_token_secret: process.env.TOKEN_SECRET
        }

    } else {
        TWITTER_CONFIG = require('../../config');
    }

    var twitter = require('twit'),
        Tweet = require('./model.js'),
        stream;

    var twit = new twitter(TWITTER_CONFIG);

    var searchTweets = function (nickname, socket) {

        console.log('searching tweets with filter',nickname)

        stream = twit.stream('statuses/filter', { track: nickname });
        stream.on('tweet', function (data) {
            console.log(data.text)
            var tweet = new Tweet(data);
            socket.emit('tweets', tweet);
        });

    };


    return {
        stream: searchTweets,
        searchTweets: function(user, socket) {
            if(stream) {
                stream.stop();
            }
            searchTweets(user, socket)
        }
    };

};
