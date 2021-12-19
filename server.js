/**
 * @description Entry file for server.
 * @author      Harrsh Patel <me@harrsh.com>
 */

require("dotenv").config();

const logger = require("./utils/logger");
const connectDB = require("./utils/db");
const routes = require("./routes/routes");
const app = require("./app");

const PORT = process.env.PORT || 3030;

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
