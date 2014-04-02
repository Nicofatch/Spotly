var connection = require('./connection.js')
    ,activity = require('./activity.js');

var db=connection.db;
var BSON=connection.BSON;

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving comment with _id = [ ' + id + ']');
    db.collection('comments', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json(item);
        });
    });
};

exports.findBySpotId = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving comment with spot_id = [ ' + id + ']');
    db.collection('comments', function(err, collection) {
        var query = { 'spot_id' : id };
        collection.find(query).limit(30).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('comments', function(err, collection) {
        collection.find().toArray(function(err, items) {
	    res.send(tems);
        });
    });
};

exports.add = function(req, res) {
    var comment = req.body; 
    comment.creationDate = new Date();
    comment.modificationDate = new Date();
    console.log('Adding comment: ' + JSON.stringify(comment));
    db.collection('comments', function(err, collection) {
        collection.insert(comment, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
                // Add corresponding activity
                activity.add(
                    {
                        body:{
                            type:'story',
                            method:'add',    
                            element_id:result[0]._id,
                            user_id:comment.author_id
                        }
                    },
                    res
                );
            }
        });
    });
}
 
exports.update = function(req, res) {
    var id = req.params.id;
    var comment = req.body;
    comment.modificationDate = new Date()
    console.log('Updating comment: ' + id);
    console.log(JSON.stringify(comment));
    db.collection('comments', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, comment, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating comment: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                comment._id = id;
                res.send(comment);
            }
        });
    });
}
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting comment: ' + id);
    db.collection('comments', function(err, collection) {
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



