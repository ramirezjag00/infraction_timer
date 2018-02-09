const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
	name: String,
	lname: String,
	username: String,
	password: String,
	department: String,
	role: String,
	manager: String,
	position: String,
	isAuthAccount: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);