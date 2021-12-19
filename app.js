const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const logger = require("./utils/logger");

const app = express();

const allowedDomains = ["http://127.0.0.1:3000", "http://localhost:3000"];
const UI_DOMAIN = process.env.UI_DOMAIN;

app.use(express.json());

app.use(helmet());

app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (
                allowedDomains.indexOf(origin) !== -1 ||
                origin.includes(UI_DOMAIN)
            ) {
                return callback(null, true);
            }

            const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        },
    })
);

app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
        stream: logger.stream,
    })
);

module.exports = app;
