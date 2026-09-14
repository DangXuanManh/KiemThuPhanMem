const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🐾 PetCare Store API Documentation',
      version: '1.0.0',
      description: 'Hệ thống REST API Quản Lý Cửa Hàng & Dịch Vụ Thú Cưng - Tài liệu chuẩn OpenAPI 3.0 phục vụ kiểm thử và tích hợp.',
      contact: {
        name: 'PetCare Store Development & Testing Team',
        email: 'admin@petcare.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT Token của Admin hoặc Customer để xác thực'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
