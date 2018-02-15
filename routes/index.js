const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
// const Deliverable = require("../models/deliverable");
// const Incident = require("../models/incident");


//ROOT ROUTE

router.get("/", function(req, res) {
	res.redirect("/incidents");
});

//register from route
router.get("/register", function(req, res) {
	res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res){
	const newUser = new User({ name: req.body.name, lname: req.body.lname, username: req.body.username, department: req.body.department, manager: req.body.manager, position: req.body.position, role: req.body.role, isAuthAccount: req.body.adminCode });
	if(req.body.adminCode === "ilovescic"){
		newUser.isAuthAccount = true;
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", `Welcome to Infraction Timer ${user.name} ${user.lname}!`);
			res.redirect("/incidents");
		});
	});
	} else {
		res.render("register");
		req.flash("error", err.message);
	}
});

//log in route
router.get("/login", function (req, res){
	res.render("login");
});

//handling log in logic
router.post("/login", passport.authenticate("local", {
successRedirect: "/incidents",
	failureRedirect: "/login",
	successFlash: "Welcome back to Infraction Timer!",
	failureFlash: true
}), function(req, res){});

//log out route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Successfully logged out!");
	res.redirect("/login");
});

module.exports = router;