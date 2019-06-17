var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	"email" : String,
	"nickname" : String,
	"briefintro" : String,
	"password" : String,
	"avatar" : String
});

var User = mongoose.model("user",userSchema);

module.exports = User;