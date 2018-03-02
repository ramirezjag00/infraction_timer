const mongoose = require("mongoose");
// const deepPopulate = require('mongoose-deep-populate')(mongoose);

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

// incidentSchema.plugin(deepPopulate);

module.exports = mongoose.model("Incident", incidentSchema);
