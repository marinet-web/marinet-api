'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (hash) {
            let defered = Q.defer();
            Models.Comment.find()
                .where('errorHash').equals(hash)
                .exec(function (err, comments) {
                    if (err) defered.reject(err);
                    defered.resolve(comments);
                });

            return defered.promise;
        }
    }
}
