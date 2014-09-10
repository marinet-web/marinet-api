'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (login) {
            let defered = Q.defer();
            Models.User.findOne()
                .where('email').equals(login)
                .exec(function (err, user) {
                    if (err) defered.reject(err);
                    defered.resolve(user);

                });

            return defered.promise;
        }
    }
}
