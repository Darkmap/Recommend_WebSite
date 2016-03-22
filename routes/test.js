/**
 * Created by qixuanwang on 16/3/20.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var list = [
        {name: 'movie1'},
        {name: 'movie2'},
        {name: 'movie3'}
    ];

    res.render('list', { title: 'Recommend', mlist: list});
});

module.exports = router;
