var tags = require('./tags.js'),
    connection = require('./connection.js');

var db=connection.db;
var BSON=connection.BSON;

exports.generate = function(req, res) {
    var sports=["Randonnée","Vélo","Chasse sous-marine","Escalade","Footing","Slackline","Skateboarding","Base Jump"];
    var sport;
    var item={};
    for (var i=0;i<100;i++) {
        for (var j=0;j<100;j++) {
            sport =  sports[Math.floor(Math.random() * sports.length)];
            item = {
                "title": sport+ '_' + i + '_' + j,
                "description": "Yeah",
                "sports": "Rando",
                "loc": [i/10,40+j/10],
                "tags": [ sport ],
                "likes": []
            };
            db.collection('spots', function(err, collection) {
                collection.insert(item, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        //console.log('Success: ' + JSON.stringify(result[0]));
                    }
                });
            });
        }
    }
    for (var i=0,l=sports.length;i<l;i++) {
        var tag = {
            value: sports[i],
            creationDate: new Date(),
            modificationDate: new Date(),
        }
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
    res.send(item);  
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving spot with _id = [ ' + id + ']');
    db.collection('spots', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            // Wrap the location in a root element called "spot".
            res.json(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('spots', function(err, collection) {
        collection.find().toArray(function(err, items) {
	    res.send(tems);
        });
    });
};

exports.search = function(req, res) {
    db.collection('spots', function(err, collection) {
        // Build search query
        var query = { 'loc' : { '$near' : [ parseFloat(req.params.lng) , parseFloat(req.params.lat) ] } };
        if (req.params.k != 'All Sports')
             query.tags = req.params.k;
        // Perform query
        collection.find(query).limit(30).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var spot = req.body.spot;
    console.log('Adding spot: ' + JSON.stringify(spot));
    db.collection('spots', function(err, collection) {
        collection.insert(spot, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
                //update tags
                for (var i=0,l=spot.tags.length;i<l;i++) {
                    tags.addIfNew(spot.tags[i]);
                }
            }
        });
    });
}
 
exports.update = function(req, res) {
    var id = req.params.id;
    var spot = req.body;
    console.log('Updating spot: ' + id);
    console.log(JSON.stringify(spot));
    db.collection('spots', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, spot, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating spot: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                spot._id = id;
                res.send(spot);
            }
        });
    });
}
 
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting spot: ' + id);
    db.collection('spots', function(err, collection) {
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

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
   var spots = [
        {
            "title": "paintball75",
            "description": "Un super terrain de paintball",
            "sports": "paintball",
            "longitude": 2.340841,
            "latitude": 48.8650429,
            "_id": "1"
        },
        {
            "title": "cinema de suresnes",
            "description": "Le meilleur cinema du grand Ouest",
            "sports": "cinema",
            "longitude": 2.242201,
            "latitude": 48.8649466,
            "_id": "2"
        },
        {
            "title": "bowling du chaton",
            "description": "Le meilleur bowling pour chats",
            "sports": "bowling",
            "longitude": 2.302201,
            "latitude": 48.9649466,
            "_id": "3"
        }
    ];
 
    db.collection('spots', function(err, collection) {
        collection.insert(spots, {safe:true}, function(err, result) {});
    });
 
};



