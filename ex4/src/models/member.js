const mongoose = require('mongoose')
const id_validator = require ('mongoose-id-validator');


var MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

MemberSchema.plugin(id_validator);
MemberSchema.index("completed");
  
const Member = mongoose.model('Member', MemberSchema);
  
module.exports = Member;