const mongoose = require("mongoose");


const DeliverableSchema = new mongoose.Schema({
	description: String,
	date:{type:Date, default: new Date()},
	deadline: Date,
	status: String,
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