var express = require("express"),
	app = express(),
 	bodyParser = require("body-parser"),
 	mongoose = require("mongoose"),
	passport = require("passport"),
	flash = require("connect-flash"),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

//requiring routes
var commentsRoute = require("./routes/comments"),
	campgroundsRoute = require("./routes/campgrounds"),	
	indexRoute = require("./routes/index");	


mongoose.connect("mongodb://localhost:27017/yelp-camp-v10", {useUnifiedTopology: true, useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //Seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Shh... its a secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 // send req.user to every route to let them know the current user and flash
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/", indexRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/comments" ,commentsRoute);


app.listen(3000, function(){
	console.log("The YelpCamp Server has started...");
})