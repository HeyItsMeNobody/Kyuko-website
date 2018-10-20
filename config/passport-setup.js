const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const keys = require('./keys.json');
const getConnection = require('../mysqlPool.js');

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    getConnection(function(err, conn) {
        var sqlselect = `SELECT * FROM websiteusers WHERE id = ${user.id};`
        conn.query(sqlselect, function (err, result) {
            if(err) console.log(err);
            if (result.length > 0) {
                done(null, result[0])
            }
        });
        conn.release();
    });
})

passport.use(new DiscordStrategy( {
    // Options for discord strategy
    clientID: keys.DiscordClientID,
    clientSecret: keys.DiscordClientSecret,
    callbackURL: '/auth/discord/redirect'
}, (accessToken, refreshToken, profile, done) => {
    // Passport callback function
    // Connect to mysql
    getConnection(function(err, conn) {
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
        conn.release();
    });
    done(null, profile)
}));