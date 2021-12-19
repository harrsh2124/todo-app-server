const express = require("express");
const UserSignIn = require("../controllers/auth/SignIn");
const UserSignUp = require("../controllers/auth/SignUp");
const { validateSignUp, validateSignIn } = require("../middleware/checkReq");

/**
 * @description Routes for user authentication.
 * @author      Harrsh Patel <me@harrsh.com>
 * @route       /todo/api/auth/*
 */
const AuthRoute = express.Router();

AuthRoute.post("/signin", validateSignIn, UserSignIn);

AuthRoute.post("/signup", validateSignUp, UserSignUp);

module.exports = AuthRoute;
