var express = require('express');
var app = express();
var authRoute = require('./auth-route');
var otherRoutes = require('./other-routes');
var passport_setup = require('./config/passport-setup.js');
var mysql = require('mysql');
var keys = require('./config/keys.json');
var cookieSession = require('cookie-session');
var passport = require('passport');

// Set up view engine
app.set('view engine','ejs');

app.use(cookieSession({
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}))

// init passport
app.use(passport.initialize());
app.use(passport.session());

// Setting up routes
app.use('/auth', authRoute);
app.use('/', otherRoutes)

// Create home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

app.listen(9999, () => {
    console.log(`Listening at port 9999!`);
});