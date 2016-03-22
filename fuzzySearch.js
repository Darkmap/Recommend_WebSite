/**
 * Created by qixuanwang on 16/3/22.
 */
var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "recommend";

/**
 * Delete an existing index
 */
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;



function addMovie(movie) {

    var input = movie.lowerName.split(" ");
    input.pop();
    return elasticClient.index({
        index: indexName,
        type: "movie",
        body: {
            id: movie.id,
            name: movie.name,
            lowerName: movie.lowerName,
            suggest: {
                input: input,
                output: movie.lowerName,
                payload: movie._id || {}
            }
        }
    });
}
exports.addMovie = addMovie;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "movie",
        body: {
            properties: {
                title: { type: "string" },
                content: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

//function getSuggestions(input) {
//    return elasticClient.suggest({
//        index: indexName,
//        type: "movie",
//        body: {
//            docsuggest: {
//                text: input,
//                completion: {
//                    field: "suggest",
//                    fuzzy: true
//                }
//            }
//        }
//    })
//}
//exports.getSuggestions = getSuggestions;

function searchMovie(keywords, operation, errorOp){
    elasticClient.search({
        index: 'recommend',
        type: 'movie',
        body: {
            query: {
                match: {
                    suggest: keywords
                }
            }
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        operation(hits);
    }, function (err) {
        errorOp(err);
    });
}
exports.searchMovie = searchMovie;