const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const secretKey = "abcdefghijklmnopqrstuvwxyzabcdef";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email address")
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 3
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    carts: Array
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 4);
        this.cpassword = await bcrypt.hash(this.cpassword, 4);
    }
    next();

})

// Genrate Token

userSchema.methods.generateAuthtoken = async function(){
    try {
        const token_one = jwt.sign({_id:this._id}, secretKey);
        this.tokens = this.tokens.concat({token: token_one});
        await this.save();
        return token_one;
    } catch (error) {
        console.log(error);
    }
}

//  add to cart data

userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error);
    }
}


const USER = new mongoose.model("USERS", userSchema);



module.exports = USER;