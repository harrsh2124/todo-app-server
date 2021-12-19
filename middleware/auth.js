const jwt = require("express-jwt");
const logger = require("../utils/logger");
require("dotenv").config();

/**
 * @description Extract the user ID out of Bearer token.
 * @author      Harrsh Patel <me@harrsh.com>
 *
 * @param       {String} authorization - Authorization token from the request header.
 * @example     Bearer <token>
 */
const authenticateToken = () => {
    return [
        jwt({
            secret: process.env.SECRET,
            algorithms: ["HS256"],
            userProperty: "auth",
            getToken: function getJWT(req) {
                let token = req.header("authorization");

                if (token) {
                    token = token.split(" ");
                    if (token[0] === "Bearer") {
                        return token[1];
                    }
                }
            },
        }),
        (err, req, res, next) => {
            logger.error("Invalid token received.");
            return res.status(err.status).json({
                success: false,
                message: err.inner.message,
            });
        },
    ];
};

module.exports = authenticateToken;
