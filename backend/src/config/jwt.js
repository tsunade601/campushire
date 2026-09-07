require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'campushire_dev_jwt_secret_key_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
