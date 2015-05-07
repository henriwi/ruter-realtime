var request = require('request');
var express = require('express');
var moment = require('moment');
var WebSocketServer = require("ws").Server
var http = require("http");
var app = express();

var port = process.env.PORT || 8000

app.use("/", express.static("public"));
var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});

wss.on("connection", function(conn) {
	doRequest(function(result) {
		conn.send(JSON.stringify(result));
	});

	var interval = setInterval(function() {
		doRequest(function(result) {
			conn.send(JSON.stringify(result));
		});
	}, 20000);

	conn.on("close", function() {
		clearInterval(interval);
	});
});

function doRequest(callback) {
	var url = "http://reisapi.ruter.no/stopvisit/getdepartures/2190090";
	console.log("Executing request %s", url);
	request(url, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var json = JSON.parse(body)

			// Only interested in the first two departures
			var departures = json.slice(0, 2);

			var result = getNextDepartures(departures);
			callback(result);
		}
	});
}

function getNextDepartures(departures) {
	var result = [];

	departures.forEach(function(departure) {
		var expectedDep = moment(departure.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime);
		var minutesToNextDeparture = moment.duration(expectedDep - moment()).minutes();
		result.push({value: minutesToNextDeparture});
	})
	return result;
}