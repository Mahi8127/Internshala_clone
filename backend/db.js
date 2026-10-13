const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connect = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            console.error("[DATABASE] Error: DATABASE_URL environment variable is missing.");
            return;
        }
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected");
    } catch (err) {
        console.error("[DATABASE] Connection error:", err.message);
    }
};