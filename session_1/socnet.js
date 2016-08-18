//Importing express, express is an extension of the NodeJS http library.
//We don't need to import http as express will do this for us
var express = require("express");
//Importing mongoose, mongoose is a connector for a mongoDB database,
//mongoose provides use with the ability to create Schemas for the
//NoSQL database on the fly.
var mongoose = require("mongoose");

//To create a server we must create an instance of express
var app = express();

//To create static routing of files we need to tell Express where to look
//if a route is not explicitly defined.
app.use(express.static(__dirname + "/public"));

//Finally we need to tell express which port to listen on,
//for demonstration purposes we will run on 1337 as anything under 1024
//requires sudo access.
app.listen(1337);
