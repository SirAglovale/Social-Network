# Creating a MEAN social network

## Prerequisits to this session are:

1. To have a basic understanding of programming.
2. Knowledge of any linux distribution, windows is a little flakey with the technologies.
3. An install of any unix based system.

##Recommended

1. Atom text editor
2. Git

## Installing node npm and mongodb
Note. These commands are for debian based OSes, if you are using a different root linux please adapt the commands to suit the distro required. MongoDB have a guided online for almost all linux distros at https://www.mongodb.com/download-center?jmp=docs&_ga=1.160474683.722406060.1470998329#community

1. Install npm
	1. `sudo apt-get update`
	2. `sudo apt-get upgrade`
	3. `sudo apt-get install npm -y`
2. Install node
	1. `sudo npm install -g n`
	2. `sudo n stable`
3. Install mongodb
	1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927`
	2. `echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list`
	3. `sudo apt-get update`
	4. `sudo apt-get install mongodb-org`

## Creating your project
This step will walk you through how to create a project in Node

1. Create a project directory
	1. run mkdir socnet
2. Change to your project directory
	1. run cd socnet
3. Create your project
	1. run npm init
	2. Fill out the prompt


	```
	name: (socnet) socnet
	version: (1.0.0) 1.0.1
	description: A simple MEAN social network
	entry point: (index.js) socnet.js
	test command: node socnet.js
	git repository: 
	keywords: 
	author: <FNAME + LINITIAL>
	license: (ISC)
	```

## Adding dependencies
This will install all of the required dependencies into the project for this session

1. Express -- For creating the server responses
	`npm install --save express`
2. Mongoose -- For querying the database
	`npm install --save mongoose`
3. Body Parser
	`npm install --save body-parser`

## Creating a basic server
This will create a static webserver to serve all of the front end dependencies

1. Import your dependencies
	1. At the top of socnet.js

	```javascript
	//This imports the dependencies for the server app
	var express = require("express");
	var mongoose = require("mongoose");
	var bodyparser = require("body-parser");
	```

2. Create an app
	1. Following on from the previous lines

	```javascript
	//This will create an instance of the express framework
	var app = express();
	```

3. Add static routes
	1. Add a route for all the public documents you wish to serve such as frontend js
	```javascript
	app.use(express.static(__dirname + "/public"));
	app.use(bodyparser.urlencoded({extended: false}));
	app.use(bodyparser.json());
	```
4. Add a listener to the server
	1. Let the server listen on a specified port
	```javascript
	app.listen(1337);
	```
5. Add the public directory
	1. Create the public directory
	```
	mkdir public
	mkdir public/js
	mkdir public/css
	mkdir public/pages
	```
	This will become important once we have downloaded the cdn content

## Downloading frontend cdn content
This will download the javascript and css libraries that will be needed for the frontend

1. Bootstrap
	1. Download the js into public/js/
	```	
	wget https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
	mv bootstrap.min.js public/js/bootstrap.min.js
	```
	2. Download the css into public/css/
	```
	wget https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
	mv bootstrap.min.css public/css/bootstrap.min.css
	```
2. Angular
	1. Download Angular
	```
	wget https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js
	mv angular.min.js public/js/angular.min.js
	```
	2. Download Angular Route
	```
	wget https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-route.min.js
	mv angular-route.min.js public/js/angular-route.min.js
	```
	3. Download Angular bootstrap-uib
	```
	wget https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.0.2/ui-bootstrap.min.js
	mv ui-bootstrap.min.js public/js/ui-bootstrap.min.js
	```
3. JQuery
	1. Download JQuery
	```
	wget https://code.jquery.com/jquery-2.2.4.min.js
	mv jquery-2.2.4.min.js public/js/jquery.min.js
	```

## Testing the sevrer
This will test the server to see if all of the content is loading correctly

1. Start the server

	`npm test`

	or

	`node socnet.js`

2. Connect to the server
	1. Open your favourite browser and navigate to `http://<IP>:1337/js/bootstrap.min.js`, if you recieve a javascript looking document you have successfully created the static server

## Setting up mongo
This will setup the database for access from the server later in this tutorial we will run mongo on a non-standard port	for the sake of simplicity we will go with port 1338

1. Create a data directory in your local file structure

	`mkdir data`

2. Start mongoDB

	`mongod --dbpath=data --port=1338`

3. Close mongoDB

	if mongo has started correctly it should tell you it is waiting for connections on port 1338.

	Press Ctrl + C to exit.

4. Start mongoDB in background

	`mongod --dbpath=data --port=1338 &`

	When mongod has finished setting up press Ctrl + C it will continue to run in background

## Connecting the Node Server to the database
Previously we installed Monogoose as a dependency of our project
	
1. Connect mongoose
	1. In the section before app.use(express.static...
	```javascript
	//Connecting the socnet database
	mongoose.connect("mongodb://localhost/socnet");
	```

2. Creating scheams
	1. Create the schema prototype
	```javascript
	//Creating the prototype schema
	var Schema = mongoose.Schema;
	```
	2. Create a user schema
	```javascript
	//Creating users
	var userSchema = new Schema({
		name: String,
		id: String,
	});
	//Creating post schema
	var postSchema = new Schema({
		id: String,
		userID: String,
		text: String
	});
	//Creating comment schema
	var commentSchema = new Schema({
		id: String,
		userID: String,
		postID: String,
		text: String
	});
	//Creating friend schema
	var friendSchema = new Schema({
		id: String,
		userOne: String,
		userTwo: String
	});
	```
3. Creating Models
	1. Use the schemas to create the models for mongo
	```javascript
	//Creating user model
	var userModel = mongoose.model("User", userSchema);
	//Creating post model
	var postModel = mongoose.model("Post", postSchema);
	//Creating comment model
	var commentModel = mongoose.model("Comment", commentSchema);
	//Creating friend model
	var friendModel = mongoose.model("Friend", friendSchema);
	```

## Adding Routes
1. GET Routes (these are for the front end app)
	1. Default Route
	```javascript
	//Creates the route for the angular app
	app.get("*", function(req, res) {
		//Sends the angular layout
		res.sendFile(__dirname + "/index.html");
	});
	```
2. POST Routes (these are for the api requests)
	1. Create User
	```javascript
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
	```
	2. Retrieve User
	```javascript
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
	```
	3. Update User
	```javascript
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
	```
	4. Create Post
	```javascript
	//Creates a post
	app.post("/post/create", function(req, res) {
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
	```
	5. Retrieve Post
	```javascript
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
	```
	6. Create Comment
	```javascript
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
	```
	7. Retrieve Comment
	```javascript
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
	```
3. Functions
	1. UUID
	```javascript
	function uuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	}
	```

# Frontend

## Index
1. Basic Layout
	1. Describe the doctype and open the HTML Document
	```html
	<!DOCTYPE html>
	<html>
	```
	2. Head -- import scripts and set titles here
	```html
	<head>
		<title>SocNet</title>
		<link href="/css/bootstrap.min.css">
		<script src="/js/jquery.min.js"></script>
		<script src="/js/bootstrap.min.js"></script>
		<script src="/js/angular.min.js"></script>
		<script src="/js/angular-route.min.js"</script>
		<script src="/js/ui-bootstrap.min.js"></script>
		<script src="/js/socnet.js"></script>
	</head>
	```
	2. Body -- This is where all of the content is displayed
	```html
	<body ng-app="SocNet">
		<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
						<span class="sr-only"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>	
					</button>
					<a class="navbar-brand">SocNet</div>
				</div>
				<span id="navbar">
					<div class="navbar-collapse collapse" id="navbar-collapse" aria-expanded="false" style="height: 1px;">
						<ul class="nav navbar-nav">

						</ul>
						<ul class="nav navbar-nav navbar-right">

						</ul>
					</div>
				</span>
			</div>
		</nav>
		<div class="container" ng-view>

		</div>
	</body>
	```
	3. Closing Document
	```html
	</html>
	```
## Angular App
1. Create the angular script
`touch public/js/socnet.js`
2. Use the following to create the app
```javascript
var app = angular.module("SocNet", ['ui.bootstrap', 'ngRoute']);

app.config(function($routeProvider))
{
	$routeProvider
	.when("/", {
		templateUrl: "ng-home.html",
		controller: "HomeCtrl"
	})
	.when("/login", {
		templateUrl: "ng-login.html",
		controller: "LoginCtrl"
	})
	.when("/register", {
		templateUrl: "ng-register.html",
		controller: "RegisterCtrl"
	})
	.when("/post", {
		templateUrl: "ng-new-post.html",
		controller: "NewPostCtrl"
	})
	.when("/posts", {
		templateUrl: "ng-old-post.html",
		controller: "OldPostCtrl"
	})
	.when("/user", {
		templateUrl: "ng-user.html",
		controller: "UserCtrl"
	});
}
```
