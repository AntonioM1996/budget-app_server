const mongoose = require("mongoose");

const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: String
    },
    {
        timestamps: true
    })
);

module.exports = Role;