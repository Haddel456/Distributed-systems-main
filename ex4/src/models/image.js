const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');

var ImageSchema = new mongoose.Schema({
  thumb: { type: String, required: true },
  description: { type: String, required: true }
});

const Image = mongoose.model('Image', ImageSchema);
ImageSchema.plugin(id_validator);
ImageSchema.index("completed");

module.exports = Image;