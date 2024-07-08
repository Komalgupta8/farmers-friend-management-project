// farm.model.js
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  crops: [{ type: String }]
});

module.exports = mongoose.model('Farm', farmSchema);