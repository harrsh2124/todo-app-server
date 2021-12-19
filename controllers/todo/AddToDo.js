const ToDo = require("../../models/ToDo");
const User = require("../../models/User");

const logger = require("../../utils/logger");

/**
 * @description Add a new ToDo item.
 * @type        POST
 * @route       /todo/api/todo/create
 * @access      Private
 */
const AddToDo = async (req, res) => {
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

        const { title, isCompleted, priority } = req.body;

        let newToDoItem = new ToDo({
            title,
            isCompleted,
            priority,
        });
        await newToDoItem.save();

        const existingUser = await User.findByIdAndUpdate(
            userID,
            {
                $push: {
                    ToDoItems: newToDoItem._id,
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
            message: "ToDo item added successfully.",
            data: {
                toDoItem: newToDoItem,
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

module.exports = AddToDo;
