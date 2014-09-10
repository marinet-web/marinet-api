'use strict';
const async = require('async');

module.exports = function (Models, Q) {

    return {
        'execute': function (id) {
            let defered = Q.defer();
            async.waterfall([

                function (next) {
                    let account = new Models.Account({
                        name: 'marinet',
                        status: 1
                    });

                    account.save(next);
            },
                function (account, rows, next) {

                    let admin = new Models.User({
                        name: 'Administrator',
                        email: 'admin@marinet.me',
                        password: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
                    });
                    account.addUser(admin);
                    admin.addRole("Administrator");
                    admin.save(function (err) {
                        if (err) next(err);
                        next(null, account);
                    });

            },
                function (account, next) {
                    let app = new Models.App({
                        _id: '540a26f033026ce20a07ec33',
                        key: 'ac0c0afe317621c1dfae6645bcf7d855b9ecf40f1162952ee3676edbba79f80b',
                        name: 'marinet'
                    });
                    account.addApp(app);
                    app.save(function (err) {
                        if (err) next(err);
                        defered.resolve(account);
                        next;
                    });
            }], function (err) {
                defered.reject(err);
            });
            return defered.promise;
        }
    }
}
