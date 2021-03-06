const express = require("express");
const router = express.Router({mergeParams:true});
const Incident = require("../models/incident");
const Deliverable = require("../models/deliverable");
const middleware = require("../middleware");

//SHOW - RESTFUL ROUTE
router.get("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, (req,res) => {
	//find the Incident with the provided ID
	Deliverable.findById(req.params.deliverable_id).populate("comments").exec((err,foundDeliverable) => {
		if(err){
			req.flash('error', 'Deliverable was not found');
			res.redirect('back');
		} else {
			res.render("deliverables/show", { incident_id: req.params.id, deliverable: foundDeliverable});	
		}
	});
});

//deliverables create
router.post("/", middleware.checkIncidentOwnership, (req,res) => {
	//lookup incident using ID
	Incident.findById(req.params.id, (err, incident) => {
		if(err){
			req.flash('error', 'Incident was not found');
			res.redirect("/incidents");
		} else {
			//create new deliverable
			Deliverable.create(req.body.deliverable, (err, deliverable) => {
				if(err){
					req.flash('error', 'Deliverable could not be created');
          			res.redirect('/incidents');
				} else {
					//add username and id to deliverable
					deliverable.owner.id = req.user._id;
					deliverable.owner.username = req.user.username;
					deliverable.owner.name = req.user.name;
					deliverable.owner.lname = req.user.lname;
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

//deliverable update route
router.put("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, (req,res) => {
	Deliverable.findByIdAndUpdate(req.params.deliverable_id, req.body.deliverable, (err) => {
		if (err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("back");
		} else {
			req.flash('success', 'Deliverable was updated');
			res.redirect("/incidents/"+ req.params.id+"/deliverables/"+req.params.deliverable_id);
		}
	});
});

//deliverable destroy route
router.delete("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, (req,res) => {
	Deliverable.findByIdAndRemove(req.params.deliverable_id, (err) => {
		if(err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("back");
		} else {
			res.redirect("/incidents/"+ req.params.id);
		}
	});
});
module.exports = router;