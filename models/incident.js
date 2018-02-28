const mongoose = require("mongoose");


const incidentSchema = new mongoose.Schema({
	title: String,
	date:{type:Date, default: new Date()},
	deadline: Date,
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
	},
	deliverables:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Deliverable"
	}
	]
});

module.exports = mongoose.model("Incident", incidentSchema);
