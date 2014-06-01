'use strict';

var express = require('express');
var io = require('socket.io');

var app = express(),
    port = 3000,
    server = require('http').createServer(app),
    io = io.listen(server);

var init = require('./app/scripts/controllers/index')(io);

app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);