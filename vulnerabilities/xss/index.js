'use strict';
var express = require('express');

function baseHandler(type, safe, req, res) {
	const input = safe ? encodeURIComponent(req[type].input)
		: req[type].input;

	const output = '<html>' + input + '</html>';
	res.send(output);
}

function makeRouteParameters(method, path, type, safe) {
	return {
		method,
		path,
		handler: baseHandler.bind(this, type, safe),
	};
}

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.get('/', function(req, res) {
		res.render('../vulnerabilities/xss/views/index');
	});

	const routeParams = {
		query:      makeRouteParameters('GET' , '/query'            , 'query'  , false),
		querySafe:  makeRouteParameters('GET' , '/querySafe'        , 'query'  , true),
		param:      makeRouteParameters('GET' , '/param/:input'     , 'params' , false),
		paramSafe:  makeRouteParameters('GET' , '/paramSafe/:input' , 'params' , true),
		header:     makeRouteParameters('GET' , '/header'           , 'headers', false),
		headerSafe: makeRouteParameters('GET' , '/headerSafe'       , 'headers', true),
		post:       makeRouteParameters('POST', '/post'             , 'body'   , false),
		postSafe:   makeRouteParameters('POST', '/postSafe'         , 'body'   , true)
	};

	Object.getOwnPropertyNames(routeParams).forEach(function(p) {
		const routeParam = routeParams[p];
		const path = routeParam.path;
		const method = routeParam.method.toLowerCase();
		api[method](path, routeParam.handler);
	});

	return api;
})();
