//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email : username,
            password: hash
        });
    
        newUser.save().then(function () {
            res.render("secrets");
        }).catch(function (err) {
            console.log(err);
        });
    });

    
});


app.post("/login",function (req,res) {

    const username = req.body.username;
    // console.log(req.body.password);
    const password = req.body.password;


    User.findOne({email : username}).then(function (foundOne) {
        bcrypt.compare(password, foundOne.password, function(err, result) {
            if (result === true){
                res.render("secrets");
            }else{
                console.log("error");
            }
        });
        }).catch(function (err) {
            console.log(err);
        })

      
})

app.listen(5000, function (req,res) {
    console.log("server started in port 3000");
})