const express = require("express");
const router = express.Router({mergeParams:true});
const Incident = require("../models/incident");
const Deliverable = require("../models/deliverable");
const Comment = require("../models/comment");
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
		Deliverable.findById(req.params.id, function(err, deliverable){
		if(err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("/incidents");
		} else {
			//create new deliverable
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', 'Comment could not be created');
          			res.redirect('/incidents');
				} else {
					//add username and id to deliverable
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.author.name = req.user.name;
					comment.author.lname = req.user.lname;
					//save deliverable
					comment.save();
					incident.deliverable.comments.push(comment);
					incident.deliverable.save();
					res.redirect("/incidents/"+incident._id);
				}
			});
		}
		});
	});
});
// //deliverables edit route
// router.get("/deliverables/:deliverable_id/edit", middleware.checkIncidentOwnership, function(req,res){
// 	Deliverable.findById(req.params.deliverable_id, function(err, foundDeliverable){
// 		if(err){
// 			req.flash('error', 'Deliverable was not found');
// 			res.redirect("back");
// 		} else {
// 			res.render("deliverables/edit", { incident_id: req.params.id, deliverable: foundDeliverable});
// 		}
// 	});
// });

// //deliverable update route
// router.put("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, function(req,res){
// 	Deliverable.findByIdAndUpdate(req.params.deliverable_id, req.body.deliverable, function(err){
// 		if (err){
// 			req.flash('error', 'Deliverable was not found');
// 			res.redirect("back");
// 		} else {
// 			res.redirect("/incidents/"+ req.params.id);
// 		}
// 	});
// });

// //deliverable destroy route
// router.delete("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, function(req,res){
// 	Deliverable.findByIdAndRemove(req.params.deliverable_id, function(err){
// 		if(err){
// 			req.flash('error', 'Deliverable was not found');
// 			res.redirect("back");
// 		} else {
// 			res.redirect("/incidents/"+ req.params.id);
// 		}
// 	});
// });
module.exports = router;