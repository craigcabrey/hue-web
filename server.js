var http = require('http');
var https = require("https");
var express = require('express');
var server = express();

server.configure(function() {
	server.use(express.static(__dirname + '/'));
    server.use(express.cookieParser('secret'));
    server.use(express.cookieSession());
    server.use(express.bodyParser());
});

server.post('/login', function(req, res) {
    var result = {
        state: '0'
    };
    
    if (req.body.userName == 'craigcabrey' && req.body.userPassword == 'password') {
        req.session.user_id = '1234567890';
    } else {
        result['state'] = '1';
    }

    res.send(JSON.stringify(result));
});

server.post('/logout', function(req, res) {
    var result = {
        state: '0'
    };

    req.session = null;
    res.send(JSON.stringify(result));
});

server.get('/api/initial', checkAuth, function(req, res) {
	http.get(
		{
			host: 'www.meethue.com',
			path: '/api/nupnp'
		},
		function(resp) {
			var result = {};

			resp.on('data', function(chunk) {
				result['bridges'] = JSON.parse(chunk);
			});

			resp.on('end', function() {
                result['user'] = { 
                    firstName: 'Craig',
                    lastName: 'Cabrey'
                };
				res.send(JSON.stringify(result));
			});
		}
	);
});

function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send("{ 'state': '1' }");
    } else {
        next();
    }
}

// Start the server.
server.listen(3000);
console.log('Listening on port 3000');
