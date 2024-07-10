const mongoose = require("mongoose")

function connectMongoDB(urp)
{
    return mongoose.connect(urp);
}

module.exports = {
    connectMongoDB,
}