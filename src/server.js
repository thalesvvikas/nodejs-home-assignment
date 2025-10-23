require('dotenv').config();
const { sequelize } = require('./models');
const app = require('./app');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('DB Connection failed:', err);
  }
})();