const serverless = require('serverless-http');
const { app } = require('./app-base.js');

module.exports.handler = serverless(app);
