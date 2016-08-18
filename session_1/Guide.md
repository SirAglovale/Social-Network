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
	`name: (socnet) socnet
	version: (1.0.0) 1.0.1
	description: A simple MEAN social network
	entry point: (index.js) socnet.js
	test command: node socnet.js
	git repository: 
	keywords: 
	author: <FNAME + LINITIAL>
	license: (ISC) 
	About to write to /home/james/SocNet/session_2/package.json:
	
	{
	  "name": "socnet",
	  "version": "1.0.1",
	  "description": "A simple MEAN social network",
	  "main": "socnet.js",
	  "scripts": {
	    "test": "node socnet.js"
	  },
	  "author": "<FNAME + LINITIAL>",
	  "license": "ISC"
	}

	Is this ok? (yes) yes`

## Adding dependencies
	This will install all of the required dependencies into the project for this session

	1. Express -- For creating the server responses
		1. run npm install --save express
	2. Mongoose -- For querying the database
		1. run npm install --save mongoose

## Creating a basic server
	This will create a static webserver to serve all of the front end dependencies

	1. Import your dependencies
		1. At the top of socnet.js

		//This imports the dependencies for the server app
		var express = require("express");
		var mongoose = require("mongoose");

	2. Create an app
		1. Following on from the previous lines

		//This will create an instance of the express framework
		var app = express();

	3. Add static routes
		1. Add a route for all the public documents you wish to serve such as frontend js

		app.use(express.static(__dirname + "/public"));

	4. Add a listener to the server
		1. Let the server listen on a specified port

		app.listen(1337);

	5. Add the public directory
		1. Create the public directory

		run mkdir public
		run mkdir public/js
		run mkdir public/css
		run mkdir public/pages

		This will become important once we have downloaded the cdn content

## Downloading frontend cdn content
	This will download the javascript and css libraries that will be needed for the frontend

	1. Bootstrap
		1. Download the js into public/js/
		
		wget https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
		mv bootstrap.min.js public/js/bootstrap.min.js

		2. Download the css into public/css/

		wget https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
		mv bootstrap.min.css public/css/bootstrap.min.css

	2. Angular
		1. Download Angular

		wget https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js
		mv angular.min.js public/js/angular.min.js

		2. Download Angular Route

		wget https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-route.min.js
		mv angular-route.min.js public/js/angular-route.min.js

		3. Download Angular bootstrap-uib

		wget https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.0.2/ui-bootstrap.min.js
		mv ui-bootstrap.min.js public/js/ui-bootstrap.min.js

## Testing the sevrer
	This will test the server to see if all of the content is loading correctly

	1. Start the server

		npm test

		or

		node socnet.js

	2. Connect to the server
		Open your favourite browser and navigate to http://<IP>:1337/js/bootstrap.min.js
		If you recieve a javascript looking document you have successfully created the
		static server

## Setting up mongo
	This will setup the database for access from the server later
	In this tutorial we will run mongo on a non-standard port
	For the sake of simplicity we will go with port 1338

	1. Create a data directory in your local file structure

		mkdir data

	2. Start mongoDB

		mongod --dbpath=data --port=1338

	3. Close mongoDB

		if mongo has started correctly it should tell you it is waiting for connections
		on port 1338.

		Press Ctrl + C to exit.

	4. Start mongoDB in background

		mongod --dbpath=data --port=1338 &

		When mongod has finished setting up press Ctrl + C
		It will continue to run in background

## Connecting the Node Server to the database
	Previously we installed Monogoose as a dependency of our project
	
	1. Connect mongoose
		1. In the section before app.use(express.static...
		//Connecting the socnet database
		mongoose.connect("mongodb://localhost/socnet");

	2. Creating scheams
		1. Create the schema prototype

		//Creating the prototype schema
		var Schema = mongoose.Schema;

		2. Create a user schema
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
