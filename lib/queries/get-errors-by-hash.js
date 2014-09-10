'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (appName, hash) {
            console.log(appName);
            console.log(hash);
            let defered = Q.defer();
            Models.Error.find()
                .where('hash').equals(hash)
                .where('appName').equals(appName)
                .exec(function (err, errors) {
                    if (err) defered.reject(err);
                    if (!errors) defered.reject({
                        message: 'Not found'
                    });
                    else {
                        let error = errors[errors.length - 1];
                        error.keys = [];
                        for (let i = 0; i < errors.length; i++) {
                            let item = errors[i];
                            console.log(item._id);
                            error.keys.push(item._id);
                        }
                        error.selected = error._id;
                        defered.resolve(error);
                    }
                });

            return defered.promise;
        }
    }
}
