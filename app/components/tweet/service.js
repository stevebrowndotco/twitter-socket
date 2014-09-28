module.exports = function (clients) {

    'use strict';

    var CONFIG = require('../../config'),
        twitter = require('twit'),
        Tweet = require('./model.js'),
        stream;

    var twit = new twitter({
        consumer_key        :   CONFIG.TWITTER.key,
        consumer_secret     :   CONFIG.TWITTER.secret,
        access_token        :   CONFIG.TWITTER.accessToken,
        access_token_secret :   CONFIG.TWITTER.tokenSecret
    });

    var openStream = function (filter, nickname) {
        stream = twit.stream(filter, { track: nickname });
    };

    var checkUser = function (nickname) {
        twit.get('users/search', { q: nickname }, function (err, reply) {

            if (!err) {
                for (var i = 0; i < reply.length; i++) {
                    var item = reply[i];
                    if (item.screen_name.toLowerCase() === nickname) {
                        clients.push(item);
                    }
                }
            } else {
                console.log('No connection found!');
            }

        });
    }

    var streamTweets = function (socket) {
        console.log('streaming tweets')
        stream.on('tweet', function (data) {
            var tweet = new Tweet(data);
            socket.broadcast.emit('tweets', tweet);
        });
    }

    var userSearch = function (nickname, socket) {
        twit.get('users/search', { q: nickname }, function (err, reply) {
            console.log(err)
            for (var i = 0; i < reply.length; i++) {
                var item = reply[i];
                if (item.screen_name.toLowerCase() === nickname) {
                    clients[0] = item;
                    socket.emit('userStartLockup', clients);
                    console.log(clients)
                    socket.broadcast.emit('userStartLockup', clients);
                }
            }
        });
    };

    var searchTweets = function (nickname, socket) {
        twit.get('search/tweets', { q: nickname }, function (err, reply) {
            stream = twit.stream('statuses/filter', { track: nickname });
            streamTweets(socket);
        });
    };

    var emit = function(tweet, socket) {
        socket.emit('startStreaming', tweet);
    };

    return {
        openStream      :       openStream,
        stream          :       streamTweets,
        searchTweets    :       searchTweets,
        userSearch      :       userSearch,
        checkUser       :       checkUser
    };

};