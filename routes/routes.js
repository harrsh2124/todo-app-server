const express = require("express");
const AuthRoute = require("./auth.routes");
const ToDoRoute = require("./todo.routes");
const UserRoute = require("./user.routes");

/**
 * @description Index route.
 * @author      Harrsh Patel <me@harrsh.com>
 * @route       /todo/api/*
 */
const routes = express();

routes.use("/auth", AuthRoute);
routes.use("/user", UserRoute);
routes.use("/todo", ToDoRoute);

module.exports = routes;
