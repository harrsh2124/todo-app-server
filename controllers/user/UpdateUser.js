const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const logger = require("../../utils/logger");

/**
 * @description Update user details.
 * @type        PUT
 * @route       /todo/api/user/update
 * @access      Private
 */
const UpdateUser = async (req, res) => {
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

        const existingUser = await User.findByIdAndUpdate(
            userID,
            req.body,
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

module.exports = UpdateUser;
