const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/', function (req, res) {
	res.send('Hello World')
})

app.get('/justhi', function(req, res){
	res.send('hi')
})

app.get('/mirror', function(req, res){
	res.json({
		body: req.body,
		cookies: req.cookies,
		hostname: req.hostname,
		ip: req.ip,
		method: req.method,
		params: req.params,
		path: req.path,
		protocol: req.protocol,
		query: req.query
	})
})

module.exports.handler = serverless(app);
