/**
 * Created by qixuanwang on 16/3/22.
 */
/**
 * Created by qixuanwang on 16/3/19.
 */
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSimSchema = new Schema(
    {
        movieId1: { type: Number, index: true },
        movieId2 : { type: Number, index: true },
        similarity : Number
    }
);

mongoose.model('MovieSim', movieSimSchema);
var MovieSim = mongoose.model('MovieSim');

function add(movieSim) {
    movieSim.save(function(err){
        if(err){
            util.log("FATAL"+err);
        }
    });
};

function findAll(operation){
    MovieSim.find({}, function (err, movieSims){
        if(err){
            return console.error(err);
        }
        operation(movieSims);
    });
}

function findByMovieId(movieId, operation){
    MovieSim.find({ $or:[ {'movieId1':movieId}, {'movieId2':movieId}]}, function (err, movieSims){
        if(err){
            return console.error(err);
        }
        operation(movieSims);
    });
}

function findByMovieIdDesc(movieId, operation, errOp){
    MovieSim.find({ $or:[ {'movieId1':movieId},
        {'movieId2':movieId}]}, function(err, docs){
        if(err){
            return errOp(err);
        }
        operation(docs);
    });
}

exports.schema = movieSimSchema;
exports.model = MovieSim;
exports.add = add;
exports.findAll = findAll;
exports.findByMovieId = findByMovieId;
exports.findByMovieIdDesc = findByMovieIdDesc;