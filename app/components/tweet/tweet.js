module.exports = function (io) {

    var clients = [],
        tweets = require('./service.js')(clients);

    var defaultNick = "barackobama",
        filter = 'statuses/filter';

    tweets.checkUser();
    tweets.openStream(defaultNick, filter);
    tweets.stream(defaultNick, filter);

    io.sockets.on('connection', function (socket) {

        console.log("client connected");
        socket.emit('clients', clients);
        stream.stop();

        tweets.searchTweets(defaultNick)
        tweets.stream(defaultNick, filter);

        socket.on('reqnick', function (nickname) {

            console.log('received request : reqnick -> ', nickname);
            defaultNick = nickname;
            stream.stop();
            tweets.userSearch(defaultNick);
            tweets.searchTweets(defaultNick);

        });

        socket.on('disconnect', function () {
            console.log('client disconnected');
        });

    })

};