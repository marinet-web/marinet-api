'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (accountId) {
            let defered = Q.defer();
            Models.App.find()
                .where('accountId')
                .equals(accountId)
                .exec(function (err, apps) {
                    if (err) defered.reject(err);
                    if (apps) {
                        let names = [];

                        for (let i = 0; i < apps.length; i++) {
                            names.push(apps[i].name);
                        }

                        Models.Error.aggregate([{
                            $match: {
                                appName: {
                                    $in: names
                                },
                                accountId: accountId
                            }
                            }, {
                            $project: {
                                accountId: '$accountId',
                                appName: '$appName',
                                open: {

                                    $cond: {
                                        if :{
                                            $eq: ["$solved", false]
                                        }, then: 1,
                                        else :0
                                    }
                                }
                            }
                            }, {
                            $group: {
                                _id: {
                                    accountId: '$accountId',
                                    appName: '$appName'
                                },
                                count: {
                                    $sum: 1
                                },
                                open: {
                                    $sum: '$open'
                                }
                            }
                            }]).exec(function (err, result) {
                            if (err) defered.reject(err);
                            else if (!result) defered.resolve([]);
                            else {
                                let values = [];

                                for (let i = 0; i < apps.length; i++) {
                                    values.push({
                                        name: apps[i].name,
                                        id: apps[i]._id,
                                        key: apps[i].key,
                                        errors: 0,
                                        openErrors: 0,
                                    });
                                }

                                for (let i = 0; i < result.length; i++) {
                                    for (let j = 0; j < values.length; j++) {
                                        if (values[j].name === result[i]._id.appName) {
                                            values[j].errors = result[i].count;
                                            values[j].openErrors = result[i].open;
                                        }
                                    }
                                }

                                defered.resolve(values);
                            }
                        });
                    } else defered.resolve([]);
                });
            return defered.promise;
        }
    }
}
