"use strict";
const textSearch = require("mongoose-text-search");

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        hash: {
            type: String,
            index: true
        },
        message: String,
        exception: String,
        currentUser: String,
        createdAt: Date,
        solved: {
            type: Boolean,
            index: true
        },
        appName: {
            type: String,
            index: true
        },
        accountId: {
            type: String,
            index: true
        },
        selected: String,
        keys: [String],
    }, {
        strict: false
    });


    schema.plugin(textSearch);
    schema.index({
        message: "text",
        exception: "text"
    });

    return mongoose.model('Error', schema);
}
