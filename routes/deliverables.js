const express = require("express");
const router = express.Router({mergeParams:true});
const Incident = require("../models/incident");
const Deliverable = require("../models/deliverable");
const middleware = require("../middleware");

// //deliverables get
// router.get("/", middleware.checkIncidentOwnership, function(req, res){
// 		//find incident by id
// 		Incident.findById(req.params.id, function(err,incident){
// 			if(err){
// 				req.flash('error', 'Incident was not found');
//      			res.redirect('back');
// 			} else {
// 				res.render("/incidents/"+incident._id, {incident: incident});
// 			}
// 		});
// });

//deliverables create
router.post("/", middleware.checkIncidentOwnership, function(req,res){
	//lookup incident using ID
	Incident.findById(req.params.id, function(err, incident){
		if(err){
			req.flash('error', 'Incident was not found');
			res.redirect("/incidents");
		} else {
			//create new deliverable
			Deliverable.create(req.body.deliverable, function(err, deliverable){
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
//deliverables edit route
router.get("/deliverables/:deliverable_id/edit", middleware.checkIncidentOwnership, function(req,res){
	Deliverable.findById(req.params.deliverable_id, function(err, foundDeliverable){
		if(err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("back");
		} else {
			res.render("deliverables/edit", { incident_id: req.params.id, deliverable: foundDeliverable});
		}
	});
});

//deliverable update route
router.put("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, function(req,res){
	Deliverable.findByIdAndUpdate(req.params.deliverable_id, req.body.deliverable, function(err){
		if (err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("back");
		} else {
			res.redirect("/incidents/"+ req.params.id);
		}
	});
});

//deliverable destroy route
router.delete("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, function(req,res){
	Deliverable.findByIdAndRemove(req.params.deliverable_id, function(err){
		if(err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("back");
		} else {
			res.redirect("/incidents/"+ req.params.id);
		}
	});
});
module.exports = router;