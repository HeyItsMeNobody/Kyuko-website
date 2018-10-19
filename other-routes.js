const router = require('express').Router();

router.get('/help', (req, res) => {
    res.render('help', {user: req.user});
});

module.exports = router;