const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuid } = require("uuid");
const logger = require("../utils/logger");

const { ObjectId } = mongoose.Schema;

/**
 * @description User details specification.
 * @author      Harrsh Patel <me@harrsh.com>
 * @class       User
 */
const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },

        encryptedPassword: {
            type: String,
            trim: true,
            required: true,
        },

        profilePhoto: {
            photo: {
                type: String,
                trim: true,
            },
            cloudinaryID: {
                type: String,
                trim: true,
            },
        },

        ToDoItems: [
            {
                type: ObjectId,
                ref: "ToDo",
            },
        ],

        salt: String,
    },
    {
        timestamps: true,
    }
);

/**
 * @description Encrypt the password.
 * @author      Harrsh Patel <me@harrsh.com>
 */
UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuid();
        this.encryptedPassword = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    /**
     * @description Compare plain and encrypted password.
     * @author      Harrsh Patel <me@harrsh.com>
     */
    authenticate(plainPassword) {
        return this.securePassword(plainPassword) === this.encryptedPassword;
    },

    /**
     * @description Encrypt the password.
     * @author      Harrsh Patel <me@harrsh.com>
     */
    securePassword(plainPassword) {
        if (plainPassword) {
            try {
                return crypto
                    .createHmac("sha256", this.salt)
                    .update(plainPassword)
                    .digest("hex");
            } catch (error) {
                logger.error("Error while hashing password!!");

                return "";
            }
        } else {
            logger.error("No password found!!");

            return "";
        }
    },
};

module.exports = mongoose.model("User", UserSchema);
