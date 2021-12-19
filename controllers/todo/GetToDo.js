const ToDo = require("../../models/ToDo");

const logger = require("../../utils/logger");

/**
 * @description Get ToDo item details.
 * @type        GET
 * @route       /todo/api/todo/details?id=:id
 * @access      Private
 *
 * @param       {String} userID
 * @param       {Number} todoID - ID of the item to fetch.
 */
const GetToDo = async (req, res) => {
    try {
        const userID = req.auth;
        const todoID = req.query.id;

        if (!userID) {
            return res.status(200).json({
                success: false,
                message: "Please enter the ID of user logged in.",
            });
        }

        if (!todoID) {
            return res.status(200).json({
                success: false,
                message: "Please enter the ID of item to be found.",
            });
        }

        const todoItem = await ToDo.findById(todoID);

        if (!todoItem) {
            return res.status(200).json({
                success: false,
                message: "User not found. Please check the item ID.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "ToDo item fetched successfully",
            data: {
                todoItem,
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

module.exports = GetToDo;
