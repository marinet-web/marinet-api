"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        message: String,
        userName: String,
        userRole: String,
        userEmail: String,
        createdAt: Date,
        errorHash: String
    });

    return mongoose.model('Comment', schema);
}
