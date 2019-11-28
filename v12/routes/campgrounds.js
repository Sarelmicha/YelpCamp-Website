var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //middleware/index.js

//INDEX - show all campgrounds
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds: allCampgrounds});
		}
	});
});

//CREATE- add new campgrounds to DB
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampgrounds = {name: name, price: price, image: image, description : description,author: author};
	//Create a new campground and save to DB
	Campground.create(newCampgrounds, function(err,newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campgrounds
router.get("/new",middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})

//SHOW - show more info about a spec campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
				//render show template with that campground
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwenrship ,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});		
	});	
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwenrship, function(req, res){
	//find and update the correct campground and redirect(show page)
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwenrship,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
})

module.exports = router;
