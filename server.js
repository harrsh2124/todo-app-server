/**
 * @description Entry file for server.
 * @author      Harrsh Patel <me@harrsh.com>
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const logger = require("./utils/logger");
const connectDB = require("./utils/db");
const routes = require("./routes/routes");

const PORT = process.env.PORT || 3030;
const allowedDomains = ["http://127.0.0.1:3000", "http://localhost:3000"];
const UI_DOMAIN = process.env.UI_DOMAIN;

const app = express();

app.use(express.json());

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
    morgan(process.env.ENV === "PROD" ? "combined" : "dev", {
        stream: logger.stream,
    })
);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}...`);
        });

        app.use("/api/v1", routes);
    })
    .catch((error) => {
        logger.error(error.message);
    });
