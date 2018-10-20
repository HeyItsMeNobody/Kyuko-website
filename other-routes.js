const router = require('express').Router();

router.get('/commands', (req, res) => {
    res.render('commands', {user: req.user});
});

module.exports = router;