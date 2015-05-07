var request = require('request');
var express = require('express');
var moment = require('moment');

var app = express();
app.set('port', (process.env.PORT || 8000));

app.use("/", express.static("public"));

app.get('/api', function(req, res) {

	request("http://reisapi.ruter.no/stopvisit/getdepartures/2190090", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var json = JSON.parse(body)

			// Only interested in the first two departures
			var departures = json.slice(0, 2);

			var result = getNextDepartures(departures);
			res.json(JSON.stringify(result));
		}
	});

})

var server = app.listen(app.get('port'), function() {
	console.log("Starting...");
})


function getNextDepartures(departures) {
	var result = [];

	departures.forEach(function(departure) {
		var expectedDep = moment(departure.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime);
		var minutesToNextDeparture = moment.duration(expectedDep - moment()).minutes();
		result.push({value: minutesToNextDeparture});
	})
	return result;
}