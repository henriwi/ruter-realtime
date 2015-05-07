$(function() {

 	var protocol = location.protocol === "https:" ? "wss:" : "ws:";
 	ws = new WebSocket(protocol + "//" + location.host);

	ws.onmessage = function (msg) {
		var result = JSON.parse(msg.data);
		$(".first").text(result[0].value);
		$(".second").text(result[1].value);
	}

});