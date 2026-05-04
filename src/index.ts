import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import studentRouter from './routes/student.routes';
import './db/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Studenti',
      version: '1.0.0',
      description: 'REST API didattiche per esercitarsi con le richieste HTTP',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/student', studentRouter);

app.listen(PORT, () => {
  console.log(`\nServer: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs\n`);
});
