const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

//user datas
const user = new Schema({
    email: {type: String, unique: true},
    name: String,
    password: String
});

export const UserModel = mongoose.model("User", user);