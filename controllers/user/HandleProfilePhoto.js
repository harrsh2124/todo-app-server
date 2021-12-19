const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const logger = require("../../utils/logger");
const cloudinary = require("../../utils/cloudinary");

/**
 * @description Handle user profile photo.
 * @type        PUT
 * @route       /todo/api/user/update/profile-photo
 * @access      Private
 *
 * @param       {String} userID
 * @param       {Form:String} [cloudinaryID]
 * @param       {Form:File} [profilePhotoFile] - Only JPEG or PNG photos of size lesser than 5MB.
 */
const HandleProfilePhoto = async (req, res) => {
    try {
        const userID = req.auth;
        const { cloudinaryID } = { ...req.body };
        const requestPayload = {};

        const options = {
            new: true,
        };

        if (!userID) {
            return res.status(200).json({
                success: false,
                message: "Please enter the ID of user to be found.",
            });
        }

        if (cloudinaryID) {
            const result = await cloudinary.uploader.destroy(cloudinaryID);

            if (result.result === "ok") {
                requestPayload["profilePhoto"] = {};
            }
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "todo-app",
            });

            const profilePhoto = {
                photo: result.secure_url,
                cloudinaryID: result.public_id,
            };

            requestPayload["profilePhoto"] = profilePhoto;
        }

        const existingUser = await User.findByIdAndUpdate(
            userID,
            requestPayload,
            options
        )
            .select({
                encryptedPassword: 0,
                salt: 0,
            })
            .populate("ToDoItems");

        if (!existingUser) {
            return res.status(200).json({
                success: false,
                message: "User not found. Please check credentials.",
            });
        }

        const token = jwt.sign(
            {
                _id: existingUser._id,
            },
            process.env.SECRET,
            {
                expiresIn: "24hr",
            }
        );

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                token,
                user: existingUser,
            },
        });
    } catch (error) {
        logger.error(error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

module.exports = HandleProfilePhoto;
