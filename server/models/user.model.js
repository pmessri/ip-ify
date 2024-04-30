const mongoose = require("mongoose");

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [
                true,
                "First Name is required."
            ],
            minlength: [
                3,
                "First Name must be at least 3 characters long."
            ]
        },
        lastname: {
            type: String,
            required: [
                true,
                "Last Name is required."
            ],
            minlength: [
                3,
                "Last Name must be at least 3 characters long."
            ]
        },
        email: {
            type: String,
            required: [
                true,
                "Email Address is required."
            ],
            unique: true,
            trim: true,
            lowercase: true,
            match: [emailRegex, "Please fill in a valid RFC-compliant Email Address."]
        },
        password: {
            type: String,
            required: [
                true,
                "Password is required."
            ],
            minlength: [
                3,
                "Password must be at least 3 characters in length."
            ]
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;