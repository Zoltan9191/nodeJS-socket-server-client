//server.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var request = require("request");
var iconv = require('iconv-lite');

io.on('connection', function (socket) {
    console.log('connection');
    var date = Date();
    var userAgent = socket.request.headers['user-agent']
    var userIp = socket.request.connection.remoteAddress;

    CaptureData(date, userIp, userAgent, 'NEW CONNECTION', '');


    socket.on('json', function (from, msg) {
        CaptureData(date, userIp, userAgent, 'JSON DATA', msg);

        //parse working but need to get some data, what is not parsed, sadly
        let json = JSON.parse(msg);
        let url = "https://www.google.com/search?q=" + json.query.replace(" ", "+");
        let requestOptions = { encoding: null, method: "GET", uri: url };

        request(requestOptions, function (error, response, body) {
            if (!error) {
                //console.log(iconv.decode(body, 'win1251')); 
            } else {
                console.log("Произошла ошибка: " + error);
            }
        });

    });

    socket.on('message', function (msg) {
        CaptureData(date, userIp, userAgent, 'RAW DATA', msg);
    });
});

function CaptureData(date, userIp, userAgent, dataType, message) {
    fs.appendFile("capture.txt", `[${date}] ${userIp} ${userAgent} ${dataType} - ${message}\n`, (err) => {
        if (err) console.log(err);
        console.log(`Successfully Written to File ${dataType}`);
    });
}

http.listen(3000, function () {
    console.log('listening on *:3000');
});

