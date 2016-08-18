//Dependencies go here
var express = require("express");
var mongoose = require("mongoose");

//Mongo connection goes here 
mongoose.connect("mongodb://localhost:1338/socnet");

//Schema Prototype goes here
var Schema = mongoose.Schema;

//Schemas go here
var userSchema = new Schema({
	name: String,
	id: String
});

var postSchema = new Schema({
	id: String,
	userID: String,
	text: String
});

var commentSchema = new Schema({
	id: String,
	userID: String,
	postID: String,
	text: String
});


//Models go here
var userModel = mongoose.model("User", userSchema);
var postModel = mongoose.model("Post", postSchema);
var commentModel = mongoose.model("Comment", commentSchema);


//express instance goes here
var app = express();

//Static data goes here
app.use(express.static(__dirname + "/public"));

//Open port goes here
app.listen(1337);
