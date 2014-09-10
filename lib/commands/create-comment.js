'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (data, user) {
            let defered = Q.defer();
            let comment = new Models.Comment(data);
            comment.userName = user.name;
            comment.userRole = user.roles[0];
            comment.userEmail = user.email;
            comment.createdAt = new Date();
            console.log(comment);

            comment.save(function (err, comment) {
                if (err) defered.reject(err);
                defered.resolve(comment);
            });

            return defered.promise;
        }
    }
}
