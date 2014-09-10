'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (appId, appKey) {
            let defered = Q.defer();
            Models.App.findById(appId).where('key').equals(appKey)
                .exec(function (err, app) {
                    if (err) defered.reject(err);
                    if (app) defered.resolve(app);
                    else defered.reject({
                        message: 'App not found'
                    });
                });

            return defered.promise;
        }
    }
}
