$(function() {
	$.get("/api", function(data) {
		var result = JSON.parse(data);
		$(".first").text(result[0].value);
		$(".second").text(result[1].value);
	});
});