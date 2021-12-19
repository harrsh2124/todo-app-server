const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuid } = require("uuid");
const logger = require("../utils/logger");

const { ObjectId } = mongoose.Schema;

/**
 * @description ToDo item details specification.
 * @author      Harrsh Patel <me@harrsh.com>
 * @class       ToDo
 */
const ToDoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },

        isCompleted: {
            type: Boolean,
            default: false,
        },

        priority: {
            type: String,
            trim: true,
            required: true,
            enum: ["high", "medium", "low"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ToDo", ToDoSchema);
