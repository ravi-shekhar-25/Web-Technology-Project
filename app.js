var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/CustomerReg");
var db = mongoose.connection;
db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

// Schema for users
var userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

var User = mongoose.model("User", userSchema);

app.post("/sign_up", (req, res) => {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  var newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
  });

  newUser.save()
    .then((user) => {
      console.log("User registered successfully:", user);
      res.redirect("dashboard.html");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving user to database.");
    });
});



app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
  
    User.findOne({ email: email, password: password })
      .then((user) => {
        if (!user) {
          res.status(404).send("User not found. Please check your credentials.");
        } else {
          // Here you can set some session or cookie to maintain the login state
          res.redirect("dashboard.html");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error finding user.");
      });
  });
  

app.get("/logout", (req, res) => {
  // Clear the session or cookie to log out the user
  // Redirect the user to the login page or any other appropriate page
  res.redirect("index.html");
});

app.get("/", (req, res) => {
  res.set({
    "Allow-acces-Allow-Origin": "*",
  });
  return res.redirect("signup.html");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
