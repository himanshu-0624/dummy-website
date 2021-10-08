const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const user = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  // console.log(req.body);
  if (!errors.isEmpty()) {
    
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
    // console.log("yaha tak pahunch gye "+req.body)
     
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "not able to save user in DB",
      });
    }
    //console.log("save ho gya bhai party")
    res.json({
      err : "No error",
      username: user.username,   
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { username, password } = req.body;
 // console.log(req.body);
  if (!errors.isEmpty()) {
   
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USERname doesnot exist in DB",
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "username and password doesnot match",
      });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // put token in cookie

    res.cookie("token", token, { expire: new Date() + 9999 });
    //send responce to frontend

    const { _id, username, age  } = user;
    return res.json({
      token,
      user: { _id,username, age},
    });
    
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user sign out successfully",
  });
};

//protected route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middleware

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "YOU ARE NOT ADMIN ACCESS DENIED",
    });
  }
  next();
};
