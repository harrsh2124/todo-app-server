const ToDo = require("../../models/ToDo");

const logger = require("../../utils/logger");

/**
 * @description Update ToDo item.
 * @type        PUT
 * @route       /todo/api/todo/update?id=:id
 * @access      Private
 */
const UpdateToDo = async (req, res) => {
    try {
        const userID = req.auth;
        const todoID = req.query.id;
        const { title, isCompleted, priority } = req.body;

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

        const todoItem = await ToDo.findByIdAndUpdate(
            todoID,
            {
                title,
                isCompleted,
                priority,
            },
            options
        );

        if (!todoItem) {
            return res.status(200).json({
                success: false,
                message: "User not found. Please check the item ID.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "ToDo item updated successfully",
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

module.exports = UpdateToDo;
