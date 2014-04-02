var connection = require('./connection.js');

var db=connection.db;
var BSON=connection.BSON;

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving activity with _id = [ ' + id + ']');
    db.collection('activity', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json(item);
        });
    });
};

exports.findBySpotId = function(req, res) {
    var id = req.params.id;
    var limit = req.paramas.limit || 30;
    console.log('Retrieving activities with spot_id = [ ' + id + ']');
    db.collection('activity', function(err, collection) {
        var query = { 'spot_id' : id };
        collection.find(query).limit(limit).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('activity', function(err, collection) {
        collection.find().toArray(function(err, items) {
        res.send(tems);
        });
    });
};

exports.add = function(req, res) {
    var activity = req.body;
    activity.creationDate = new Date();
    activity.modificationDate = new Date();
    console.log('Adding activity: ' + JSON.stringify(activity));
    db.collection('activity', function(err, collection) {
        collection.insert(activity, {safe:true}, function(err, result) {
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
    var activity = req.body;
    activity.modificationDate = new Date()
    console.log('Updating activity: ' + id);
    console.log(JSON.stringify(activity));
    db.collection('activity', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, activity, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating activity: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                activity._id = id;
                res.send(activity);
            }
        });
    });
}
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting activity: ' + id);
    db.collection('activity', function(err, collection) {
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



