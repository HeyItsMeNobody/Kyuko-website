const router = require('express').Router();
const passport = require('passport');

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.redirect('/');
})

// auth with discord
router.get('/discord', passport.authenticate('discord', {
    scope: ['identify', 'guilds']
}), (req,res) => {res.send('Redirecting to discord..')})

// Callback route
router.get('/discord/redirect', passport.authenticate('discord'), (req,res) => {
    res.redirect('/');
})

module.exports = router;