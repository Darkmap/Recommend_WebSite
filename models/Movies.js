/**
 * Created by qixuanwang on 16/3/19.
 */

var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var movieSchema = new Schema(
    {
        id: { type: Number, index: true },
        name : String,
        lowerName : String,
        types : [String]
    }
);

mongoose.model('Movie', movieSchema);
var Movie = mongoose.model('Movie');


function add(movie) {

    movie.save(function(err){
        if(err){
            util.log("FATAL"+err);
        }
    });
};

function findById(movieId, operation){

    if(!parseInt(movieId)){
        operation(null);
    } else{
        Movie.findOne({"id":movieId}, function (err, movie){
            if(err){
                return console.error(err);
            }
            console.log("Searching movie by: id ="+movieId);
            operation(movie);
        });
    }
}

function findAll(operation){
    Movie.find({}, function (err, movies){
        if(err){
            return console.error(err);
        }
        operation(movies);
    });
}

exports.schema = movieSchema;
exports.model = Movie;
exports.add = add;
exports.findById = findById;
exports.findAll = findAll;