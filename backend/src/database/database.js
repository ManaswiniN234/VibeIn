const mongoose = require("mongoose");

const connectDatabase = async (URL) => {
    try {
        await mongoose.connect(URL);
        console.log("Connected to database successfully");
    }
    catch (error) {
        console.log("Error connecting to database.");
        console.log(error);
    }
}

module.exports = connectDatabase;