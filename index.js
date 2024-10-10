require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger setup
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/nettool', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication middleware
const authenticatePassword = (req, res, next) => {
  const providedPassword = req.headers['x-api-key'];
  if (providedPassword !== process.env.API_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Routes
app.get('/protected', authenticatePassword, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// POST endpoints
app.post('/post1', authenticatePassword, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  res.json({ response: `Received message for post1: ${message}` });
});

app.post('/post2', authenticatePassword, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  res.json({ response: `Received message for post2: ${message}` });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/nettool`);
});