module.exports = function (io) {

    'use strict';

    var clients = [],
        tweets = require('./service.js')(clients);

    var defaultNick = "test ",
        filter = 'statuses/filter';

    tweets.checkUser();
    tweets.openStream(defaultNick, filter);
    tweets.stream(defaultNick, filter);

    io.sockets.on('connection', function (socket) {
        console.log("client connected");
        socket.emit('clients', clients);
        tweets.searchTweets(defaultNick, socket)
        socket.on('disconnect', function () {
            console.log('client disconnected');
        });
        socket.on('change user', function(user) {
            console.log('change user');
        })
    });

};