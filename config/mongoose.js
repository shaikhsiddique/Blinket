const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("Connected to mongodb")
})

module.exports = mongoose.connection;