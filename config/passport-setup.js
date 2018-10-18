const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const keys = require('./keys.json');
var mysql = require('mysql');

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    var conn = mysql.createConnection({
        host: keys.mysqlHost,
        user: keys.mysqlUser,
        password: keys.mysqlPassword,
        database: keys.mysqlDatabase,
        supportBigNumbers: true,
        bigNumberStrings: true
    });
    conn.connect();
    var sqlselect = `SELECT * FROM websiteusers WHERE id = ${id};`
    conn.query(sqlselect, function (err, result) {
        if(err) console.log(err);
        if (result.length > 0) {
            done(null, result[0].id)
        }
    })
})

passport.use(new DiscordStrategy( {
    // Options for discord strategy
    clientID: keys.DiscordClientID,
    clientSecret: keys.DiscordClientSecret,
    callbackURL: '/auth/discord/redirect'
}, (accessToken, refreshToken, profile, done) => {
    // Passport callback function
    //Connect to mysql
    var conn = mysql.createConnection({
        host: keys.mysqlHost,
        user: keys.mysqlUser,
        password: keys.mysqlPassword,
        database: keys.mysqlDatabase,
        supportBigNumbers: true,
        bigNumberStrings: true
    });
    conn.connect();
    var sqlselect = `SELECT 1 FROM websiteusers WHERE id = ${profile.id};`
    conn.query(sqlselect, function (err, result) {
        if (err) console.log(err);
        console.log(`Selecting id ${profile.id} from user database..`)
        if (result.length > 0) {
            var sqldelete = `DELETE FROM websiteusers WHERE id = ${profile.id};`
            conn.query(sqldelete, function (err, result) {
                if (err) console.log(err);
                var sqlinsert2 = `INSERT INTO websiteusers VALUES (${profile.id}, "${profile.username}", "https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg?size=1024")`
                conn.query(sqlinsert2, function (err, result) {
                    if (err) console.log(err);
                    console.log(`There already was a user with ${profile.id} so deleted and added again.`)
                })
            })
        }
        else {
            var sqlinsert = `INSERT INTO websiteusers VALUES (${profile.id}, "${profile.username}", "https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg?size=1024")`
            conn.query(sqlinsert, function (err, result) {
                if (err) console.log(err);
                console.log(`No user found with ${profile.id} so added it.`)
            })
        }
    })
    done(null, profile)
}));