'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const config = require('./config');

let host = 'chattkn.com' + ':' + config.port;

if (process.env.NODE_ENV === 'develop') host = 'localhost' + ':' + config.port; 
// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Era-X',
    version: '1.0.0',
    description: 'Era-X application API with Swagger',
  },
  host,
  basePath: '/api'
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;