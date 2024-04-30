const mongoose = require("mongoose");
const UserSchema = require('./user.model.js');

const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const IPSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        customerName: {
            type: String,
            required: [
                true,
                "Customer Name is required."
            ],
            minlength: [
                3,
                "Customer Name must be at least 3 characters in length."
            ]
        },
        ip: {
            type: String,
            required: true,
            unique: true,
            match: [ipv4Regex, "Please fill in a valid IPv4 address."]
        },
        subnetmask: {
            type: String,
            required: true,
        },
        assignedOn: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const IP = mongoose.model("IP", IPSchema);

module.exports = IP;