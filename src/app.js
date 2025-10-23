const express = require('express');
const morgan = require('morgan');
const app = express();
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerDocs = require('./config/swagger');


app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);
swaggerDocs(app);

module.exports = app;