"use strict";

module.exports = function (mongoose) {
    let provider = mongoose.Schema({
        name: String,
        token: String,
    });



    let schema = mongoose.Schema({
        name: String,
        password: String,
        email: String,
        accountId: String,
        accountName: String,
        roles: [String],
        providers: [provider],
    });

    schema.methods.addRole = function (role) {
        this.roles.push(role);
    };

    return mongoose.model('User', schema);
}
