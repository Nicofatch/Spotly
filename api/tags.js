var connection = require('./connection.js');
var db=connection.db;
var BSON=connection.BSON;

exports.findByValue = function(req, res) {
    var q = req.query.q || req.query.input;
    console.log('Retrieving tags with value contains [ ' + q + ']');
    var query = { 'value': new RegExp('^' + q, 'i') };
    db.collection('tags', function(err,collection) {
        collection.find(query).toArray(function(err,items){
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving tag with _id = [ ' + id + ']');
    db.collection('tags', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            // Wrap the location in a root element called "spot".
            res.json(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('tags', function(err, collection) {
        collection.find().toArray(function(err, items) {
	    res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var tag = req.body;
    tag.creationDate = new Date();
    tag.modificationDate = new Date();
    console.log('Adding tag: ' + JSON.stringify(tag));
    db.collection('tags', function(err, collection) {
        collection.insert(tag, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.addIfNew = function(tagValue) {
    db.collection('tags', function(err,collection) {
    	collection.findOne({'value':tagValue}, function(err, item) {
    	    if (!item) {
    		var tag = {'value':tagValue};
    		tag.creationDate = new Date();
    		tag.modificationDate = new Date();
    		console.log('Adding tag: ' + JSON.stringify(tag));
    		db.collection('tags', function(err, collection) {
    		    collection.insert(tag, {safe:true}, function(err, result) {
    			if (err) {
    			    res.send({'error':'An error has occurred'});
    			} else {
    			    console.log('Success: ' + JSON.stringify(result[0]));
    			}
    		    });
    		});
    	    }
    	});
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    var tag = req.body;
    tag.modificationDate = new Date();
    console.log('Updating tag: ' + id);
    console.log(JSON.stringify(tag));
    db.collection('tags', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, tag, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating tag: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                tag._id = id;
		res.send(tag);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting tag: ' + id);
    db.collection('tags', function(err, collection) {
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
