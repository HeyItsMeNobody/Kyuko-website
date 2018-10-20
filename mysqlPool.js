var mysql = require('mysql');
var keys = require('./config/keys.json');

var pool = mysql.createPool({
    host: keys.mysqlHost,
    user: keys.mysqlUser,
    password: keys.mysqlPassword,
    database: keys.mysqlDatabase,
    supportBigNumbers: true,
    bigNumberStrings: true
});

var getConnection = function(callback) {
    pool.getConnection(function(err, conn) {
        callback(err, conn);
    });
}

module.exports = getConnection;