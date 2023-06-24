//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app   = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const userSchema =new mongoose.Schema({
    email : String,
    password : String
});


const User = mongoose.model("User",userSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const username = req.body.username;
    console.log(req.body.username);
    const password = md5(req.body.password);

    const newUser = new User ({
        email : username,
        password: password
    });

    newUser.save().then(function () {
        res.render("secrets");
    }).catch(function (err) {
        console.log(err);
    });
});


app.post("/login",function (req,res) {

    const username = req.body.username;
    // console.log(req.body.password);
    const password = md5(req.body.password);

    User.findOne({email : username}).then(function (foundOne) {
        if (foundOne.password === password){
            res.render("secrets");
        }else{
            console.log("error");
        }
    }).catch(function (err) {
        console.log(err);
    })
})

app.listen(5000, function (req,res) {
    console.log("server started in port 3000");
})