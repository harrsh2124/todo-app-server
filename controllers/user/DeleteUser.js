const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const logger = require("../../utils/logger");

/**
 * @description Delete the user.
 * @type        DELETE
 * @route       /todo/api/user/delete
 * @access      Private
 *
 * @param       {String} userID
 */
const DeleteUser = async (req, res) => {
    try {
        const userID = req.auth;

        const options = {
            new: true,
        };

        if (!userID) {
            return res.status(200).json({
                success: false,
                message: "Please enter the ID of user to be found.",
            });
        }

        const existingUser = await User.findByIdAndRemove(userID, options);

        if (!existingUser) {
            return res.status(200).json({
                success: false,
                message: "User not found. Please check credentials.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        logger.error(error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

module.exports = DeleteUser;
