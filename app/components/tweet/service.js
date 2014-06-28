module.exports = function (clients) {

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

    var streamTweets = function () {
        stream.on('tweet', function (data) {
            console.log('now streaming!');
            var tweet = new Tweet(data);
            io.sockets.emit('tweets', tweet);
        })
    }

    var userSearch = function (nickname) {
        twit.get('users/search', { q: nickname }, function (err, reply) {
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
    }

    var searchTweets = function (nickname) {
        twit.get('search/tweets', { q: nickname }, function (err, reply) {
            if (reply.statuses) {
                for (var i = 0; i < reply.statuses.length; i++) {
                    var element = reply.statuses[i];
                    var tweet = new Tweet(element)
                    socket.emit('startStreaming', tweet);
                    socket.broadcast.emit('startStreaming', tweet);
                }
            }
            stream = twit.stream('statuses/filter', { track: nickname });
            streamTweets();
        })
    }

    return {

        openStream: function (filter, nickname) {
            return openStream(filter, nickname);
        },
        stream: function (filter, nickname) {
            return streamTweets(filter, nickname)
        },
        searchTweets: function (nickname) {
            return searchTweets(nickname);
        },
        userSearch: function (nickname) {
            return userSearch(nickname);
        },
        checkUser: function (nickname) {
            return checkUser(nickname);
        }
    }

};