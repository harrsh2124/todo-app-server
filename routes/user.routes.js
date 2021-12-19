const express = require("express");
const DeleteUser = require("../controllers/user/DeleteUser");
const GetUser = require("../controllers/user/GetUser");
const HandleProfilePhoto = require("../controllers/user/HandleProfilePhoto");
const UpdateUser = require("../controllers/user/UpdateUser");
const authenticateToken = require("../middleware/auth");
const { validateUpdateUser } = require("../middleware/checkReq");
const upload = require("../middleware/multer");

/**
 * @description Routes for the user.
 * @author      Harrsh Patel <me@harrsh.com>
 * @route       /todo/api/user/*
 */
const UserRoute = express.Router();

UserRoute.get("/details", authenticateToken(), GetUser);

UserRoute.put("/update", authenticateToken(), validateUpdateUser, UpdateUser);

UserRoute.put(
    "/update/profile-photo",
    authenticateToken(),
    upload.single("profilePhotoFile"),
    HandleProfilePhoto
);

UserRoute.delete("/delete", authenticateToken(), DeleteUser);

module.exports = UserRoute;
