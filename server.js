var http = require('http');
var https = require("https");
var express = require('express');
var server = express();

server.configure(function() {
	server.use(express.static(__dirname + '/'));
    server.use(express.cookieParser('secret'));
    server.use(express.cookieSession());
    server.use(express.bodyParser());
    server.set('api_key', '5dd0bbd153aa3073a7075793e2eb723');
});

/*
 * Result object used in every function. Always start by assuming
 * that the authentication has been done and let checkAuth() handle
 * letting the client know of an unauthed situation.
 *
 * '0' state indicates successfull auth
 * '1' state indicates unsuccessful auth
 */
var result = {
    state: '0'
};

/**
 * Server side JavaScript login function that simply GETs the
 * current state of authentication in the app.
 */
server.get('/login', function(req, res) {
    if (!req.session.user_id) {
        result['state'] = '1';
    } else {
        result['state'] = '0';
    }

    res.send(JSON.stringify(result));
});

/**
 * Server side JavaScript login function that allows the client
 * to authorize themselves by supplying credentials for the server
 * to verify.
 */
server.post('/login', function(req, res) {
    if (req.body.userName == 'datto' && req.body.userPassword == 'datto') {
        result['state'] = '0';
        req.session.user_id = '1234567890';
    } else {
        result['state'] = '1';
    }

    console.log(result);
    res.send(JSON.stringify(result));
});

/**
 * Server side JavaScript logout function.
 */
server.post('/logout', function(req, res) {
    req.session = null;
    result = {
        state: '0'
    };
    res.send(JSON.stringify(result));
});

/**
 * Server side JavaScript function to get the initial
 * state of the application. Can include user information,
 * application settings, and bridge information.
 */
server.get('/api/initial', checkAuth, function(req, res) {
	http.get(
		{
			host: 'www.meethue.com',
			path: '/api/nupnp'
		},
		function(resp) {
			resp.on('data', function(data) {
				result['bridges'] = JSON.parse(data);
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

/**
 * Turn all lights off.
 */
server.post('/api/:bridge/all_off', checkAuth, function(req, res) {
    http.get(
        {
            host: req.params.bridge,
            path: '/api/' + app.get('api_key') + '/lights'
        },
        function(resp) {
            resp.on('data', function(data) {
                var lights = JSON.parse(data);

                for (var light in lights) {
                    if (lights.hasOwnProperty(light)) {
                        http.put(
                            { 
                                host: req.params.bridge,
                                path: '/api' + app.get('api_key') + '/lights/' + light
                            },
                            function(resp) {

                            }
                        );
                    }
                }
            })
        }
    );
});
/**
 * Helper JavaScript function to check the current
 * auth status of the connecting client.
 */
function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        result['state'] = '1';
        res.send(JSON.stringify(result));
    } else {
        next();
    }
}

// Start the server.
server.listen(3000);
console.log('Listening on port 3000');
