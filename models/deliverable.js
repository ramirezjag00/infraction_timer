const mongoose = require("mongoose");


const DeliverableSchema = new mongoose.Schema({
	description: String,
	date: {type:Date, default: new Date()},
	endDate: {type:Date, default: new Date(+new Date() + 7*24*60*60*1000)},
	status: {type:String, default: "In Progress"},
	owner: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:Number,
		name: String,
		lname:String
	}
});

module.exports = mongoose.model("Deliverable", DeliverableSchema);