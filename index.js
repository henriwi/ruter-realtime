var request = require('request');
var express = require('express');
var moment = require('moment');

var app = express();
app.set('port', (process.env.PORT || 8000));

app.use("/", express.static("public"));

app.get('/api', function(req, res) {

	request("http://reisapi.ruter.no/stopvisit/getdepartures/2190090", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var departures = JSON.parse(body)
			var expectedDep = moment(departures[0].MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime);
			var minutesToNextDeparture = moment.duration(expectedDep - moment()).minutes();

			var result = {value: minutesToNextDeparture};
			res.json(JSON.stringify(result));
		}
	});

})

var server = app.listen(app.get('port'), function() {
	console.log("Starting...");
})