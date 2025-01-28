import mongoose from "mongoose";
import app from "./app";
import config from "./config";

// Make sure we are running node 10+
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 10 || (major === 10 && minor <= 8)) {
    console.log(
        "🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou're on an older version of node that doesn't support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ",
    );
    process.exit();
}

// Connect to our Database and handle any bad connections
mongoose.connect(config.database, {});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on("error", err => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

const server = app.listen(config.port, () => {
    console.log(`Express running → PORT ${config.port}`);
});

export default server;
