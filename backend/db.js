const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
};