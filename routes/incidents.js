//Incidents Route
const express = require("express");
const router = express.Router();
const Incident = require("../models/incident");
const Deliverable = require("../models/deliverable");
const Comment = require("../models/comment");
const User = require("../models/user");
const middleware = require("../middleware");

//GET ROUTE


router.get("/", middleware.isLoggedIn, function(req,res){
	var noMatch = null;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Incident.find({title: regex}, function(err, allIncidents){
			User.find({}, function(err, allUsers){
			if(err){
				res.redirect('back');
			} else {
				if(allIncidents.length === 0){
					noMatch = "'"+req.query.search+"'"+ " did not match incidents";
				}
				res.render("incidents/index", {incidents:allIncidents, users: allUsers, noMatch:noMatch});
			}
			});         
		});
	} else {
		Incident.find({}, function(err, allIncidents){
			User.find({}, function(err, allUsers){
				if(err){
					res.redirect('back');
				} else {
					res.render("incidents/index", {incidents:allIncidents, users: allUsers, noMatch:noMatch});
				}
			});
		});
	}
});


//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req,res) {
	const title = req.body.title;
	const status = req.body.status;
	const description = req.body.description;
	const owner = req.body.owner;
	const deadline = req.body.deadline;
	const createdBy = {
		id: req.user._id,
		username: req.user.username,
		name: req.user.name,
		lname: req.user.lname
	};
	
	const newIncident = {title: title, status: status, description: description, owner: owner, createdBy: createdBy, deadline: deadline}
	//create a new incident and save to DB
	Incident.create(newIncident, function(err, newlyCreated) {
		if (err) {
			req.flash('error', 'Incident could not be created');
			res.redirect('back');
		} else {
			req.flash('success', 'Incident was added');
			res.redirect("/incidents");
		} 
		
	});
});

// NEW ROUTE

// router.get("/new", middleware.isLoggedIn, function(req,res) {
// 	User.find({}, function(err, allUsers){
// 		if(err) {  
// 			console.log(err);
// 		} else {
// 			res.render("incidents/new", {users: allUsers});
// 		}
// 	});
// });

//SHOW - RESTFUL ROUTE
router.get("/:id", middleware.checkIncidentOwnership, function(req,res) {
	//find the Incident with the provided ID
	Incident.findById(req.params.id).populate("deliverables").exec(function(err,foundIncident){
		if(err){
			req.flash('error', 'Incident was not found');
			res.redirect('back');
		} else {
			res.render("incidents/show", {incident: foundIncident});	
		}
	});
});

// //update requestToChangeStatus Route
// router.put("/:id", middleware.isLoggedIn, function(req,res){
// 	Incident.findByIdAndUpdate(req.params.id, {$set:{"requestToChangeStatus":"true"}}, function(err, updatedIncident){
// 		if(err){
// 			req.flash("error", err.message);
// 		} else {
// 			req.flash("success", "Your request to change incident status has been sent!");
// 			res.redirect("/incidents/" + req.params.id);
// 		}
// 	});
// });

//UPDATE ROUTE
router.put("/:id", middleware.checkIncidentOwnership, function(req,res) {
	Incident.findByIdAndUpdate(req.params.id, req.body.incident, function(err, updatedIncident) {
		if(err) {
			req.flash('error', 'Incident was not found');
			res.redirect("/incidents");
		} else {
			req.flash('success', 'Incident was updated');
			res.redirect("/incidents/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkIncidentOwnership, function(req,res){
	Incident.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', 'Incident was not found');
			res.redirect('back');
		} else {
			req.flash("success", "Incident deleted!");
			res.redirect("/incidents");
		}
	});
});

//def for search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;