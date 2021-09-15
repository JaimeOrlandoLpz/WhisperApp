//jshint esversion:6
// Jaime Orlando López
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});

const userSchema =  new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");

});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    // Obtain Input from the user
    const username = req.body.username;
    const password = req.body.password;

    // Database Verification
    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(error);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password,
                    (err, result)=>{
                    if(result === true){
                        res.render("secrets");
                    }
                });
            }
        }

    });
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
        const newUser = User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});