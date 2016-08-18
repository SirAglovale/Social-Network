//Dependencies go here
var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
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
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


//Routes go here
//Creates the route for the angular app
app.get("*", function(req, res) {
    //Sends the angular layout
    res.sendFile(__dirname + "/index.html");
});

//Creates the route for creating users
app.post("/user/create", function(req, res) {
    //If the post sent no name then send error code "UC-0"
    if(req.body.name == undefined)
    {
        res.send("UC-0");
    }
    //If the name sent is too short send error code "UC-1"
    else if(req.body.name.length < 2)
    {
        res.send("UC-1");
    }
    else
    {
        userModel.findOne({name: req.body.name}, function(err, user) {
            //If the query errors send the error code
            if(err)
            {
                res.send("UC-2");
            }
            //If there is already a user with that name send the error code
            if(user)
            {
                res.send("UC-3");
            }
            //Otherwise create the user
            else
            {
                //Create a new user
                var user = new userModel({
                    name: req.body.name,
                    id: uuid()
                });
                //Save the user
                user.save();
                //Send a success code
                res.send("UC-2");
            }
        });
    }
});

//Gets a user from the database
app.post("/user/get", function(req, res) {
    //Send error code if there is no name
    if(req.body.name == undefined)
    {
        res.send("UG-0");
    }
    //Otherwise find all models with that name
    else
    {
        userModel.find({name: req.body.name}, function(err, user) {
            //If there is an error finding users send error code
            if(err)
            {
                res.send("UG-1");
            }
            //Otherwise send a list of users matching that description
            else
            {
                res.send(JSON.stringify(user));
            }
        });
    }
});

//Updates a specific user
app.post("/user/update", function(req, res) {
    //Send error code if name is undefined
    if(req.body.name == undefined || req.body.newname == undefined)
    {
        res.send("UU-0");
    }
    else
    {
        userModel.update({name: req.body.name}, {name: newname});
    }
});

//Creates a post
app.post("/post/create", function(req, res) {
    console.log(JSON.stringify(req.body));
    if(req.body.text == undefined || req.body.userID == undefined)
    {
        res.send("PC-0");
    }
    else if(req.body.text.length < 5)
    {
        res.send("PC-1");
    }
    else if(req.body.userID == "")
    {
        res.send("PC-2");
    }
    else
    {
        var post = new postModel({
            id: uuid(),
            userID: req.body.userID,
            text: req.body.text
        });

        post.save();
        res.send("PC-3");
    }
});

//Retrieves all posts
app.post("/post/get", function(req, res) {
    postModel.find({}, function(err, posts) {
        if(err)
        {
            res.send("PG-0");
        }
        else
        {
            res.send(JSON.stringify(posts));
        }
    });
});

//Creates a comment
app.post("/comment/create", function(req, res) {
    //Checking for errors
    if(req.body.text == undefined || req.body.postID == undefined || req.body.userID == undefined)
    {
        res.send("CC-0");
    }
    else if(req.body.text == "")
    {
        res.send("CC-1");
    }
    else if(req.body.postID == "")
    {
        res.send("CC-2");
    }
    else if(req.body.userID == "")
    {
        res.send("CC-3");
    }
    //Creating comment
    else
    {
        var comment = new commentModel({
            id: uuid(),
            userID: req.body.userID,
            postID: req.body.postID,
            text: req.body.text
        });

        comment.save();
        res.send("CC-4");
    }
});

//Gets comments for a post
app.post("/comment/get", function(req, res) {
    //Checking for errors
    if(req.body.postID == undefined || req.body.postID == "")
    {
        res.send("CG-0");
    }
    else
    {
        commentModel.find({postID: req.body.postID}, function(err, comments) {
            if(err)
            {
                res.send("CG-1");
            }
            else
            {
                res.send(JSON.stringify(comments));
            }
        });
    }
});

//Open port goes here
app.listen(1337);
