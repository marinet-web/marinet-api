"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        name: String,
        status: Number
    });

    schema.methods.addUser = function (user) {
        user.accountId = this.id;
        user.accountName = this.name;
    };

    schema.methods.addApp = function (app) {
        app.accountId = this.id;
    };

    return mongoose.model('Account', schema);
}
