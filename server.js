var http = require('http');
var https = require("https");
var express = require('express');
var server = express();

server.configure(function() {
	server.use(express.static(__dirname + '/'));
});

server.get('/api/bridges', function(req, res) {
	http.get(
		{
			host: 'www.meethue.com',
			path: '/api/nupnp'
		},
		function(resp) {
			var output = '';
			
			resp.on('data', function(chunk) {
				output += chunk;
			});

			resp.on('end', function() {
				var result = {};
				
				result['bridges'] = JSON.parse(output);
				res.send(JSON.stringify(result));
			});
		}
	);
});

// Start the server.
server.listen(3000);
console.log('Listening on port 3000');
