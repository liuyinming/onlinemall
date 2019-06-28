var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/lymmall', {useNewUrlParser: true});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected success.")
})
mongoose.connection.on("error", () => {
    console.log("MongoDB connected fail.")
})
mongoose.connection.on("disconnected", () => {+
    console.log("MongoDB connected disconnected.")
});

var Schema = mongoose.Schema;

var managerSchema = new Schema({
    "managerId": String,
    "email": String,
    "managerName": String,
    "password": String  
})

var managers = mongoose.model('Manager', managerSchema);
module.exports = managers;