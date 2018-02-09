const mongoose = require("mongoose");


const IncidentSchema = new mongoose.Schema({
	title: String,
	date:{type:Date, default: new Date()},
	deadline: {type:Date, default: new Date(+new Date() + 30*24*60*60*1000)},
	status: {type:String, default: "Issued"},
	description: String,
	owner: String,
	createdBy: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		name: String,
		lname: String,
	}
});

module.exports = mongoose.model("Incident", IncidentSchema);