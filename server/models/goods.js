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

var productSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
    "productUrl": String,
    "productNum": Number,
    "checked": String
})

var goods = mongoose.model('Good', productSchema);
module.exports = goods;