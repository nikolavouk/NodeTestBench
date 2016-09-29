var session = require('express-session');
var express = require('express');
var csrf = require('csurf');

module.exports = (function() {
	'use strict';
	var api = express.Router();


	//Vulnerable routes(no csrf token generated or applied)
	api.get('/csrf-vulnerable', function(req, res) {
	   res.render('../vulnerabilities/csrf/views/index', {
		   csrfToken: 'none'
	   });
	});
	api.post('/csrf-form-unprotected', function(req, res){
		res.send('CSRF Token is not required to post to this page');
    });

	//Configure csrf protection
    api.use(session({ secret:'such-secret', saveUninitialized: true, resave: true}));
    api.use(csrf());

	//safe routes
    api.get('/csrf-safe', function(req, res) {
		res.render('../vulnerabilities/csrf/views/index', {
            csrfToken: req.csrfToken()
        });
	});
	api.post('/csrf-form-protected', function(req, res){
		res.send('CSRF Token must match original request token:  ' + req.body._csrf);
    });

	return api;
})();
