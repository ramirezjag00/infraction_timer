const express = require("express");
const router = express.Router({mergeParams:true});
const Incident = require("../models/incident");
const Deliverable = require("../models/deliverable");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//deliverables create
router.post("/deliverables/:deliverable_id", middleware.checkIncidentOwnership, (req,res) => {
	//lookup Deliverable using ID
		Deliverable.findById(req.params.deliverable_id, (err, deliverable) => {
		if(err){
			req.flash('error', 'Deliverable was not found');
			res.redirect("/incidents");
		} else {
			//create new deliverable
			Comment.create(req.body.comment, (err, comment) => {
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
					deliverable.comments.push(comment);
					deliverable.save();
					res.redirect("/incidents/"+ req.params.id+"/deliverables/"+req.params.deliverable_id);
				}
			});
		}
		});
});

module.exports = router;