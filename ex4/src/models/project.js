const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');
const ImageSchema = require('./image').schema;

var TeamMemberSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    role: { type: String, required: true }
  });
  
  var ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, required: true, minlength: 20, maxlength: 80 },
    start_date: { type: Date, required: true },
    manager: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
      },
    team: [TeamMemberSchema],
    images: [ImageSchema]
  });

  
ProjectSchema.plugin(id_validator);
ProjectSchema.index("completed");


const Project = mongoose.model('Project', ProjectSchema );

module.exports = Project