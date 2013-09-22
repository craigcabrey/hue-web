$(document).ready(function() {
	$.get("http://www.meethue.com/api/nupnp", function(data) {
		$("#BridgeID").html(data);
		alert("GET completed.");
	});
});
