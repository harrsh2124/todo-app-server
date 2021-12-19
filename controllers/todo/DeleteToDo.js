const ToDo = require("../../models/ToDo");
const User = require("../../models/User");

const logger = require("../../utils/logger");

/**
 * @description Delete ToDo item.
 * @type        DELETE
 * @route       /todo/api/todo/delete?id=:id
 * @access      Private
 *
 * @param       {String} userID
 * @param       {Number} todoID - ID of the item to delete.
 */
const DeleteToDo = async (req, res) => {
    try {
        const userID = req.auth;
        const todoID = req.query.id;

        const options = {
            new: true,
        };

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

        const todoItem = await ToDo.findByIdAndDelete(todoID);

        if (!todoItem) {
            return res.status(200).json({
                success: false,
                message: "ToDo item not found. Please check the item ID.",
            });
        }

        console.log(todoItem);

        const existingUser = await User.findByIdAndUpdate(
            userID,
            {
                $pull: {
                    ToDoItems: todoItem._id,
                },
            },
            options
        );

        if (!existingUser) {
            return res.status(200).json({
                success: false,
                message: "User not found. Please check credentials.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "ToDo item deleted successfully",
        });
    } catch (error) {
        logger.error(error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

module.exports = DeleteToDo;
