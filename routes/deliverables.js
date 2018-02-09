const express = require("express");
const router = express.Router({mergeParams:true});
const Incident = require("../models/incident");
const Deliverable = require("../models/deliverable");
const middleware = require("../middleware");

//deliverables new
router.get("/", middleware.isLoggedIn, function(req, res){
		//find incident by id
		Incident.findById(req.params.id, function(err,incident){
			if(err){
				console.log(err);
			} else {
				res.render("/incidents/"+incident._id, {incident: incident});
			}
		});
});

//deliverables create
router.post("/", middleware.isLoggedIn, function(req,res){
	//lookup incident using ID
	Incident.findById(req.params.id, function(err, incident){
		if(err){
			console.log(err);
			res.redirect("/incidents");
		} else {
			//create new deliverable
			Deliverable.create(req.body.deliverable, function(err, deliverable){
				if(err){
					console.log(err);
				} else {
					//add username and id to deliverable
					deliverable.author.id = req.user._id;
					deliverable.author.username = req.user.username;
					deliverable.author.name = req.user.name;
					deliverable.author.lname = req.user.lname;
					//save deliverable
					deliverable.save();
					incident.deliverables.push(deliverable);
					incident.save();
					res.redirect("/incidents/"+incident._id);
				}
			});
		}
	});
});
//////////////////////////////
//deliverables edit route
router.get("/", middleware.checkDeliverableOwnership, function(req,res){
	Deliverable.findById(req.params.deliverable_id, function(err, foundDeliverable){
		if(err){
			res.redirect("back");
		} else {
			res.render("/incidents/"+incident._id, { incident_id: req.params.id, deliverable: foundDeliverable});
		}
	});
});

//deliverable update route
router.put("/", middleware.checkDeliverableOwnership, function(req,res){
	Deliverable.findByIdAndUpdate(req.params.deliverable_id, req.body.deliverable, function(err, updatedDeliverable){
		if (err){
			res.redirect("back");
		} else {
			res.redirect("/incidents/"+ req.params.id);
		}
	});
});

//deliverable destroy route
router.delete("/:deliverable_id", middleware.checkDeliverableOwnership, function(req,res){
	Deliverable.findByIdAndRemove(req.params.deliverable_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/incidents/"+req.params.id);
		}
	});
});
//////////////////////////////
module.exports = router;