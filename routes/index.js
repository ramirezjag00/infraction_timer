const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Deliverable = require("../models/deliverable");
const Incident = require("../models/incident");
const middleware = require("../middleware");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const smtpTransport = require('nodemailer-smtp-transport');

//ROOT ROUTE

router.get("/", (req, res) =>
	res.redirect("/incidents"));

//register from route
router.get("/register", middleware.isLoggedOut, (req, res) =>
	res.render("register"));

//handle sign up logic
router.post("/register", middleware.isLoggedOut, (req, res) => {
	const newUser = new User({ name: req.body.name, lname: req.body.lname, username: req.body.username, department: req.body.department, email: req.body.email, position: req.body.position, role: req.body.role, isAuthAccount: req.body.adminCode });
	if(req.body.adminCode === "ilovescic"){
		newUser.isAuthAccount = true;
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			req.flash("error", "Fill up all forms and make sure that employee number/username or email is unique!");
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
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
router.get("/login", middleware.isLoggedOut, (req, res) =>
	res.render("login"));

//handling log in logic
router.post("/login", middleware.isLoggedOut, passport.authenticate("local", {
successRedirect: "/incidents",
	failureRedirect: "/login",
	successFlash: "Welcome back to Infraction Timer!",
	failureFlash: true
}), function(req, res){});

//log out route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out!");
	res.redirect("/login");
});

//install dotenv and make .env file with the GMAILPW=yourPWHere
//turn off less secure apps in the gmail you will use
//https://myaccount.google.com/lesssecureapps
// forgot password
router.get('/forgot', (req, res) => {
  res.render('forgot');
});

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 600000; // 10 min

        user.save((err) => {
          done(err, token, user);
        });
      });
    },
    (token, user, done) => {
      const transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com', 
        auth: {
          user: 'n00n3xx@gmail.com',
          pass: process.env.GMAILPW
        }
      }));
      const mailOptions = {
        to: user.email,
        from: 'n00n3xx@gmail.com',
        subject: 'Infraction Timer Account Password Reset',
        text: 'Hi '+ user.name +',\n\n' +
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'This password reset is only valid for the next 10 minutes. Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email or send us a message and your password will remain unchanged.\n\n' +
          'P.S. We also love hearing from you and helping you with any issues you have. Please reply to this email if you want to ask a question or just say hi. \n\n' +
          'Thanks,\n\n' +
          'MIS - Infraction Timer Team\n'
      };
      transporter.sendMail(mailOptions, (err) => {
        console.log('Email has been sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], (err) => {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, (err) => {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    (user, done) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com', 
        auth: {
          user: 'n00n3xx@gmail.com',
          pass: process.env.GMAILPW
        }
      }));
      const mailOptions = {
        to: user.email,
        from: 'n00n3xx@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello '+user.name+',\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n' +
          'Thanks,\n\n' +
          'MIS - Infraction Timer Team\n'
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], (err) => {
    res.redirect('/campgrounds');
  });
});

module.exports = router;