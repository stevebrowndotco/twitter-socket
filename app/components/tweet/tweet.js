module.exports = function (io) {

    var clients = [],
        tweets = require('./service.js')(clients);

    var defaultNick = "a",
        filter = 'statuses/filter';

    tweets.checkUser();
    tweets.openStream(defaultNick, filter);
    tweets.stream(defaultNick, filter);

    io.sockets.on('connection', function (socket) {
        console.log("client connected");
        socket.emit('clients', clients);
//        stream.stop();
        tweets.searchTweets(defaultNick, socket)
//        tweets.stream(socket);

        socket.on('disconnect', function () {
            console.log('client disconnected');
        });

    })

};