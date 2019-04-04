var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lymmall', {useNewUrlParser: true});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected success.")
})
mongoose.connection.on("error", () => {
    console.log("MongoDB connected fail.")
})
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connected disconnected.")
});

var Schema = mongoose.Schema;

var productSchema = new Schema({
    "userId": String,
    "userName": String,
    "email":String,
    "userPwd": String,
    "orderList": [
        {
            "orderId": String,
            "orderTotal": Number,
            "addressInfo": {
                "addressId": String,
                "userName": String,
                "streetName": String,
                "postCode": Number,
                "tel": Number,
                "isDefault": Boolean
            },
            "goodsList":[
                {
                    "productId": String,
                    "productName": String,
                    "salePrice": Number,
                    "productImage": String,
                    "productNum": Number,
                    "checked": String
                }
            ],
            "orderStatus": String,
            "createDate": String
        }
    ],
    "cartList": [{
        "productId": String,
        "productName": String,
        "salePrice": Number,
        "productImage": String,
        "productNum": Number,
        "checked": String
    }],
    "addressList": [{
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": Number,
        "tel": Number,
        "isDefault": Boolean
    }]
})

var users = mongoose.model('User', productSchema);
module.exports = users;