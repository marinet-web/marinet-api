'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (hash) {
            let defered = Q.defer();
            Models.Error.update({
                hash: hash
            }, {
                solved: true
            }, {
                multi: true
            }).exec(function (err, numberAffected, raw) {
                console.log("Updated %s docs", numberAffected);
                if (err) defered.reject(err);
                defered.resolve(raw);
            });

            return defered.promise;
        }
    }
}
