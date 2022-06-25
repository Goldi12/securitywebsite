require('dotenv').config()
const express = require("express");
const bodyParser = require("body-Parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://admin-goldi:goldigupta12@cluster0.47xcq.mongodb.net/loginData");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("login")
});

app.get("/register", function(req, res){
  res.render("register")
});



app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("home")
    }
  });
});

app.post("/", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, findUser){
    if(err){
      console.log(err);
    }else{
      if(findUser){
        if(findUser.password === password){
          res.render("home")
        }
      }
    }
  });
});









let port = process.env.PORT;
if (port == null || port == "" ){
  port = 3000;
}

app.listen(port, function(){
  console.log("server has started Succeessfully");

});
