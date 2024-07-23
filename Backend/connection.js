const mongoose = require("mongoose");

async function connectMongoDB(uri) {
    return mongoose.connect(uri);
}

module.exports = {    connectMongoDB,
};
