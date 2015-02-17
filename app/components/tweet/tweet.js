module.exports = function (io) {

    'use strict';

    var clients = [],
        tweets = require('./service.js')(clients);

    var defaultNick = "testing",
        filter = 'statuses/filter';

    io.sockets.on('connection', function (socket) {

        console.log("client connected");

        socket.emit('clients', clients);

        tweets.searchTweets(defaultNick, socket)

        socket.on('disconnect', function () {
            console.log('client disconnected');
        });

        socket.on('change filter', function (user) {
            tweets.newSearch(user, socket);
        });

    });

};
