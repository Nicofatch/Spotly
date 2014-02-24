var connection = require('./connection.js');

var db=connection.db;
var BSON=connection.BSON;

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving data with _id = [ ' + id + ']');
    db.collection('datas', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json(item);
        });
    });
};

exports.findBySpotId = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving data with spot_id = [ ' + id + ']');
    db.collection('datas', function(err, collection) {
         collection.findOne({'spot_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('datas', function(err, collection) {
        collection.find().toArray(function(err, items) {
        res.send(tems);
        });
    });
};

exports.add = function(req, res) {
    var data = req.body; 
    data.creationDate = new Date();
    data.modificationDate = new Date();
    console.log('Adding data: ' + JSON.stringify(data));
    db.collection('datas', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.update = function(req, res) {
    var id = req.params.id;
    var data = req.body;
    data.modificationDate = new Date();
    data.spot_id = BSON.ObjectID(data.spot_id);
    console.log('Updating data: ' + id);
    console.log(JSON.stringify(data));
    db.collection('datas', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, data, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating data: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                data._id = id;
                res.send(data);
            }
        });
    });
}
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting data: ' + id);
    db.collection('datas', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send({});
            }
        });
    });
};



