"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        key: String,
        name: String,
        accountId: String,
    });

    return mongoose.model('App', schema);
}
