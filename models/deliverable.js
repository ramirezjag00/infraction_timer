const mongoose = require("mongoose");
// const deepPopulate = require('mongoose-deep-populate')(mongoose);

const deliverableSchema = new mongoose.Schema({
	description: String,
	date: {type:Date, default: new Date()},
	endDate: Date,
	status: {type:String, default: "In Progress"},
	owner: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:Number,
		name: String,
		lname:String
	},
	comments:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}
	]
});

// deliverableSchema.plugin(deepPopulate);

module.exports = mongoose.model("Deliverable", deliverableSchema);