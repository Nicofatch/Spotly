var connection = require('./connection.js');

var db=connection.db;
var BSON=connection.BSON;

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving topo with _id = [ ' + id + ']');
    db.collection('topos', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json(item);
        });
    });
};

exports.findBySpotId = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving topo with spot_id = [ ' + id + ']');
    db.collection('topos', function(err, collection) {
         collection.findOne({'spot_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('topos', function(err, collection) {
        collection.find().toArray(function(err, items) {
        res.send(tems);
        });
    });
};

exports.add = function(req, res) {
    var topo = req.body; 
    topo.creationDate = new Date();
    topo.modificationDate = new Date();
    console.log('Adding topo: ' + JSON.stringify(topo));
    db.collection('topos', function(err, collection) {
        collection.insert(topo, {safe:true}, function(err, result) {
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
    var topo = req.body;
    topo.modificationDate = new Date();
    topo.spot_id = BSON.ObjectID(topo.spot_id);
    console.log('Updating topo: ' + id);
    db.collection('topos', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, topo, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating topo: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                topo._id = id;
                res.send(topo);
            }
        });
    });
}
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting topo: ' + id);
    db.collection('topos', function(err, collection) {
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



