const express = require("express");
const AddToDo = require("../controllers/todo/AddToDo");
const DeleteToDo = require("../controllers/todo/DeleteToDo");
const GetToDo = require("../controllers/todo/GetToDo");
const UpdateToDo = require("../controllers/todo/UpdateToDo");
const authenticateToken = require("../middleware/auth");
const { validateToDoItem } = require("../middleware/checkReq");

/**
 * @description Routes for todo item.
 * @author      Harrsh Patel <me@harrsh.com>
 * @route       /todo/api/todo/*
 */
const ToDoRoute = express.Router();

ToDoRoute.get("/details", authenticateToken(), GetToDo);

ToDoRoute.post("/create", authenticateToken(), validateToDoItem, AddToDo);

ToDoRoute.put("/update", authenticateToken(), validateToDoItem, UpdateToDo);

ToDoRoute.delete("/delete", authenticateToken(), DeleteToDo);

module.exports = ToDoRoute;
