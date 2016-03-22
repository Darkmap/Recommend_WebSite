var express = require('express');
var router = express.Router();
var async = require("async");
var movieDao = require('../models/Movies');
var movieSimDao = require('../models/MovieSims');
var fuzzysearch = require('../fuzzySearch');

router.post('/', function(req, res) {

    if(!req.body.keywords){
        return res.render('error', {
            message: "Sorry, please input something :(",
            error: {}
        });
    }

    fuzzysearch.searchMovie(req.body.keywords, function(hits){

        if(!hits || hits.length==0){
            res.render('error', {
                message: "Sorry, I cannot find it.",
                error: {}
            });
        } else{
            res.render('searchList', { title: 'Recommend', mlist: hits});
        }
    }, function(error){
        res.render('error', {
            message: error.message,
            error: {}
        });
    });



    //movieDao.findById(req.body.keywords, function(movie){
    //    if(movie) {
    //        res.send(movie.name);
    //    } else {
    //        res.render('error', {
    //            message: "Sorry, I cannot find it.",
    //            error: {}
    //        });
    //    }
    //})
});

router.post('/recommend', function(req, res) {

    if(!req.body.id){
        return res.render('error', {
            message: "Sorry, I cannot find it.",
            error: {}
        });
    }

    movieSimDao.findByMovieIdDesc(req.body.id, function(docs){

        if(!docs||docs.length==0){
            return res.render('error', {
                message: "Sorry, we have no recommendations.",
                error: {}
            });
        }

        docs.sort(function(a,b){
            return b.similarity- a.similarity;
        });

        docs = docs.slice(0, 20);

        console.log('docs.length:'+docs.length);

        var ids = [];
        for(var dkey in docs){
            ids.push(String(docs[dkey].movieId1) === String(req.body.id)? docs[dkey].movieId2 : docs[dkey].movieId1);
        }

        var simMovies = [];
        async.series([
                function(callback) {

                    for (var idx in ids) {
                        movieDao.findById(ids[idx], function (movie) {
                            if (movie) {
                                simMovies.push(movie.name);
                                //console.log(movie.name);
                                if(simMovies.length==20){
                                    console.log('simMovies.length: '+simMovies.length);
                                    res.render('resList', { title: 'Recommend', mlist: simMovies});
                                    callback(null, 'find movies.');
                                }
                            } else {
                                res.render('error', {
                                    message: 'Sorry, I cannot find the recommendations.',
                                    error: {}
                                });
                            }
                        })
                    }
                }
            ],
            function(err, results){
                console.log(results);
            }
        );

    }, function(error){
        res.render('error', {
            message: error.message,
            error: {}
        });
    });


    //movieDao.findById(req.body.keywords, function(movie){
    //    if(movie) {
    //        res.send(movie.name);
    //    } else {
    //        res.render('error', {
    //            message: "Sorry, I cannot find it.",
    //            error: {}
    //        });
    //    }
    //})
});


module.exports = router;
