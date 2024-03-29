var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all the middleware goes here!
var middlewareObj = {};

middlewareObj.checkCampgroundOwenrship = function checkCampgroundOwenrship(req, res, next){
	
	if(req.isAuthenticated()){
		//check if logged in
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		} else {
			// does user own campground?
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error","You dont have permission to do that");
				res.redirect("back");
			}	
		}
	});	
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}	
}

middlewareObj.checkCommentOwenrship = function checkCommentOwenrship(req, res, next){
	
	if(req.isAuthenticated()){
		//check if logged in
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			// does user own comment?
			if(foundComment.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error","You dont have permission to do that");
				res.redirect("back");
			}	
		}
	});	
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}	
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj