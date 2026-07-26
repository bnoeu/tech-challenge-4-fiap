import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tech Challenge 2 - FIAP API',
            version: '1.0.0',
            description: 'API de gerenciamento de postagens educacionais'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./src/modules/post/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);