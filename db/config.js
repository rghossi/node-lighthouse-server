const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/node-lighthouse';

module.exports = function setupMongoDB() {
  mongoose.connect(MONGODB_URI, {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true,
  });
}