var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('spotdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'spotdb' database");
    }
});

exports.db = db;
exports.BSON = BSON;

