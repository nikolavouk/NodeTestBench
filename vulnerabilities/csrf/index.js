var session = require('express-session');
var express = require('express');
var csrf = require('csurf');

module.exports = (function() {
	'use strict';
	var api = express.Router();


	//Vulnerable routes
	api.get('/csrf-vulnerable', function(req, res) {
	   res.render('../vulnerabilities/csrf/views/index', {
		   csrfToken: 'none'
	   });
	});
	api.post('/csrf-form-unprotected', function(req, res){
		res.send('any user can access this page');
    });

	//Configure csrf protection
    api.use(session({ secret:'so-secret', saveUninitialized: true, resave: true}));
    api.use(csrf());

	//safe routes
    api.get('/csrf-safe', function(req, res) {
		res.render('../vulnerabilities/csrf/views/index', {
            csrfToken: req.csrfToken()
        });
	});
	api.post('/csrf-form-protected', function(req, res){
		res.send('only user with matching token can access this page');
    });



	return api;
})();
