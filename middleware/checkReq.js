const { check, validationResult } = require("express-validator");

/**
 * @description Defining checks for different fields.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const checks = {
    checkName: check("name")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Name is required."),
    checkUserName: check("username")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Username is required.")
        .isLength({
            min: 5,
        })
        .withMessage("Username must be at least 5 characters long."),
    checkEmail: check("email")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email."),
    checkPassword: check("password")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Password is required.")
        .isLength({
            min: 5,
        })
        .withMessage("Password must be at least 5 characters long."),
    checkConfirmationPassword: check("confirmationPassword")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Confirmation password is required.")
        .isLength({
            min: 5,
        })
        .withMessage(
            "Confirmation password must be at least 5 characters long."
        )
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords does not match.");
            }
            return true;
        }),
    optionalCheckName: check("name")
        .optional()
        .not()
        .trim()
        .isEmpty()
        .withMessage("Name is required."),
    optionalCheckEmail: check("email")
        .optional()
        .not()
        .trim()
        .isEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email."),
    optionalCheckUserName: check("username")
        .optional()
        .not()
        .trim()
        .isEmpty()
        .withMessage("Username is required.")
        .isLength({
            min: 5,
        })
        .withMessage("Username must be at least 5 characters long."),

    checkToDoTitle: check("title")
        .not()
        .trim()
        .isEmpty()
        .withMessage("ToDo title is required."),
    checkToDoStatus: check("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("ToDo status should be boolean true or false only."),
    checkToDoPriority: check("priority")
        .not()
        .trim()
        .isEmpty()
        .withMessage("ToDo priority is required.")
        .custom((value) => {
            if (!["high", "medium", "low"].includes(value)) {
                throw new Error(
                    "ToDo priority should be High, Medium or Low only."
                );
            }
            return true;
        }),
};

/**
 * @description Check user details on Sign Up.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const signUpCheckReq = () => [
    checks.checkName,
    checks.checkUserName,
    checks.checkEmail,
    checks.checkPassword,
    checks.checkConfirmationPassword,
];

/**
 * @description Check user details on Sign In.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const signInCheckReq = () => [checks.checkEmail, checks.checkPassword];

/**
 * @description Check user details while updating the user.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const updateUserCheckReq = () => [
    checks.optionalCheckName,
    checks.optionalCheckUserName,
    checks.optionalCheckEmail,
];

/**
 * @description Check todo item details while creating the todo item.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const addToDoCheckReq = () => [
    checks.checkToDoTitle,
    checks.checkToDoStatus,
    checks.checkToDoPriority,
];

/**
 * @description Check for any error.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const returnErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }
    next();
};

/**
 * @description Validate user details on Sign Up.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const validateSignUp = [signUpCheckReq(), returnErrors];

/**
 * @description Validate user details on Sign In.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const validateSignIn = [signInCheckReq(), returnErrors];

/**
 * @description Validate user details while updating the user.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const validateUpdateUser = [updateUserCheckReq(), returnErrors];

/**
 * @description Validate todo item details while creating the todo item.
 * @author      Harrsh Patel <me@harrsh.com>
 */
const validateToDoItem = [addToDoCheckReq(), returnErrors];

module.exports = {
    validateSignUp,
    validateSignIn,
    validateUpdateUser,
    validateToDoItem,
};
