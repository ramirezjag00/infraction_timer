//all the middleware goes here
const Incident = require("../models/incident");
const User = require("../models/user");
const Deliverable = require("../models/deliverable");
const middlewareObj = {};

middlewareObj.isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

middlewareObj.checkIncidentOwnership = (req,res,next) => {
		if(req.isAuthenticated()){
			Incident.findById(req.params.id, (err, foundIncident) => {
				if(err){
				res.redirect("back");
				} else {
				if(foundIncident.createdBy.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				}
			});
	} else {
		res.redirect("back");
	}
}

middlewareObj.checkDeliverableOwnership = (req,res,next) => {
		if(req.isAuthenticated()){
			Deliverable.findById(req.params.deliverable_id, (err, foundDeliverable) => {
				if(err){
				res.redirect("back");
				} else {
					//does user own the deliverable?
				if(foundDeliverable.owner.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				}
			});
	} else {
		res.redirect("back");
	}
} 

module.exports = middlewareObj;
