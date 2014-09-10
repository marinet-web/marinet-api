'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (id) {
            let defered = Q.defer();
            Models.Error.findById(id)
                .exec(function (err, data) {
                    if (err) defered.reject(err);
                    defered.resolve(data);
                });

            return defered.promise;
        }
    }
}
