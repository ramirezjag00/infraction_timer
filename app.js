//SET UP
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
//REQUIRING MODELS
const Deliverable = require("./models/deliverable");
const Incident = require("./models/incident");
const User = require("./models/user");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");




//REQUIRING ROUTES
const incidentRoutes = require("./routes/incidents");
const indexRoutes = require("./routes/index");
const deliverableRoutes = require("./routes/deliverables");

//APP CONFIG
mongoose.connect("mongodb://localhost/infraction_timer6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"fpvpavargrrafriraglfvk",
	resave:false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//ROUTES APP CONFIG
app.use("/", indexRoutes);
app.use("/incidents", incidentRoutes);
app.use("/incidents/:id", deliverableRoutes);


app.get("*", function(req, res) {
    res.send("You are trying to access a page that does not exist.");
});

//SERVER
app.listen(4000 | process.env.PORT, process.env.IP, function(){
	console.log("INFRACTION TIMER SERVER STARTED at port 4000");
});