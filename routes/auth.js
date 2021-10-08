var express = require("express");

var router = express.Router();
const { check } = require("express-validator");
const { signup, signout, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("username", "name at least of 3 character").isLength({ min: 3 }),
    check("password", "password at least of 3 character").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("username", "username is required").isLength({ min: 3 }),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
