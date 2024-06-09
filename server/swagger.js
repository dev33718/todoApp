const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'Todo API Information',
      contact: {
        name: 'Devesh Sarraf',
        email: 'sarrafdevesh1879@gmail.com'
      },
      servers: [{
        url: 'http://localhost:5000',
        description: 'Local server'
      }]
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = { specs, swaggerUi };