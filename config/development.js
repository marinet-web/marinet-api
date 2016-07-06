'use strict';

var MONGO_HOST = process.env.MONGOLAB_URI || 'localhost:27017';

module.exports = {
    'db': 'mongodb://'+MONGO_HOST+'/marinetdb',
    'secret':'very secret key',
    'dbName': 'marinetdb',
    'account': {
        'defaultId': '005aeacc-d8ce-48c6-9ed8-cb89aa29bdad'
    },
    'allowedOrigins': ['localhost', 'localhost:9003', 'localhost:4200', 'marinet.me', 'http://marinet.herokuapp.com', 'http://marinet.herokuapp.com','marinet.herokuapp.com'],
    'marinet': {
        'app': {
            'key': 'ac0c0afe317621c1dfae6645bcf7d855b9ecf40f1162952ee3676edbba79f80b',
            'id': '540a26f033026ce20a07ec33'
        },
        'rootUrl': 'http://marinet-api.herokuapp.com'
    },
}
