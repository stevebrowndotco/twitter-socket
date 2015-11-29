'use strict';

console.log('running app')

var express = require("express");
var io = require('socket.io');

var app = express(),
    server = require('http').createServer(app),
    io = io.listen(server, {transports: ['polling', 'websocket']});

app.use('/public', express.static(__dirname + '/public'));

app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var init = require('./app/components/tweet/tweet.js')(io);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
});


app.get('/user', function (req, res) {

    res.send({
        hello: 'hello'
    })
});

server.listen(process.env.PORT || 3000);


