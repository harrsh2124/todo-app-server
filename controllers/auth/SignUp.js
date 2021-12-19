const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const logger = require("../../utils/logger");

/**
 * @description Route for user Sign Up.
 * @type        POST
 * @route       /todo/api/auth/signup
 * @access      Public
 */
const UserSignUp = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                },
                {
                    username,
                },
            ],
        });

        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "User already exists.",
            });
        }

        let newUser = new User({
            username,
            name,
            email,
            password,
        });
        await newUser.save();

        newUser = newUser.toJSON();
        delete newUser.salt;
        delete newUser.encryptedPassword;

        const token = jwt.sign(
            {
                _id: newUser._id,
            },
            process.env.SECRET,
            {
                expiresIn: "24hr",
            }
        );

        return res.status(200).json({
            success: true,
            message: "User signed up successfully.",
            data: {
                token,
                user: newUser,
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

module.exports = UserSignUp;
