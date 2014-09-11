'use strict';

const
    crypto = require('crypto');

module.exports = function (Models, Q) {

    return {
        'execute': function (password, user) {
            console.log('Validating passowrd');
            let hash = crypto.createHash('sha512').update(password).digest("hex");

            return user.password == hash;
        }
    }
}
