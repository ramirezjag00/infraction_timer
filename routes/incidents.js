//Incidents Route
const express = require("express");
const router = express.Router();
const Incident = require("../models/incident");
// const Deliverable = require("../models/deliverable");
const User = require("../models/user");
const middleware = require("../middleware");

//GET ROUTE


router.get("/", middleware.isLoggedIn, function(req,res) {
	//get all incidents from DB

	Incident.find({}, function(err, allIncidents) {
		User.find({}, function(err, allUsers){
			if(err) {  
				console.log(err);
			} else {
				res.render("incidents/index", {incidents: allIncidents, users: allUsers});
			}
		});
	});
});


//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req,res) {
	const title = req.body.title;
	const status = req.body.status;
	const description = req.body.description;
	const owner = req.body.owner;
	const createdBy = {
		id: req.user._id,
		username: req.user.username,
		name: req.user.name,
		lname: req.user.lname
	};
	
	const newIncident = {title: title, status: status, description: description, owner: owner, createdBy: createdBy}
	//create a new incident and save to DB
	Incident.create(newIncident, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
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
router.get("/:id", middleware.isLoggedIn, function(req,res) {
	//find the Incident with the provided ID
	Incident.findById(req.params.id, function(err,foundIncident){
		if(err){
			res.redirect("incidents/index");
		} else {
			res.render("incidents/show", {incident: foundIncident});	
		} 
	});
});

// //GET EDIT  INCIDENT ROUTE
// router.get("/:id/edit", middleware.checkIncidentOwnership, function(req,res){
// 	Incident.findById(req.params.id, function(err, foundIncident){
// 		res.render("incidents/edit", {incident: foundIncident});	
// 	});
// });


//UPDATE ROUTE

router.put("/:id", middleware.checkIncidentOwnership, function(req,res) {
	Incident.findByIdAndUpdate(req.params.id, req.body.incident, function(err, updatedIncident) {
		if(err) {
			req.flash("error", err.message);
			res.redirect("/incidents");
		} else {
			req.flash("success", "Update Successful!");
			res.redirect("/incidents/" + req.params.id);
		}
	});
});


// // //UPDATE STATUS ROUTE
// router.put("/:id", middleware.checkIncidentOwnership, function(req,res){
// 	Incident.findByIdAndUpdate(req.params.id, {$set:{status: done}}, function(err, updatedIncident){
// 				if(err){
// 					console.log(err);
// 				} else {
// 					req.flash("success", "Status update has been successful! Please notify the employee.");
// 					res.redirect("/incidents/" + req.params.id);
// 				}
// 			});
// });



//DESTROY ROUTE
router.delete("/:id", middleware.checkIncidentOwnership, function(req,res){
	Incident.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/indidents");
		} else {
			req.flash("success", "Incident deleted!");
			res.redirect("/incidents");
		}
	});
});


module.exports = router;