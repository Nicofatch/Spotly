var tags = require('./tags.js'),
    connection = require('./connection.js');

var db=connection.db;
var BSON=connection.BSON;

exports.generate = function(req, res) {
    var sports=["Randonnée","Vélo","Chasse sous-marine","Escalade","Footing","Slackline","Skateboarding","Base Jump"];
    var sport;  
    var spotId;
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
                        spotId = result[0]._id;
                        var topo = {
                            "text":"<h2>Accès</h2>De Chamonix, direction le col des Montets. A la sortie d’Argentière, 1km après les lacets, se garer au parking de Tré-le-Champ Le-Haut, juste avant le Col des Montets.<br><br><h2>Difficultés - Remarques</h2>Pendant la montée, après <b>l’Aiguillette d’Argentière</b>, on rencontre toute une série d’échelles et d’escaliers, ainsi que des mains courantes pour certains passages en vire. Sans être difficiles, ni très exposés, ces passages demandent un peu de vigilance et peuvent éprouver les personnes vraiment sensibles au vertige.<br><br>Le retour peut se faire par le même sentier ou bien par un sentier plus aisé permettant ainsi de faire une boucle.<br><br><h2>Descriptif de l'itinéraire</h2>Du parking de <b>Tré-le-Champ le-Haut</b>, prendre le sentier (GR) en direction de <b>l’Aiguillette d’Argentière</b>. Il s’élève un moment au-dessus de la route, puis monte à flanc dans les mélèzes.<br><br><span>On laisse sur la gauche le sentier descendant sur&nbsp;<b>Argentière&nbsp;</b>pour continuer sur la droite et rejoindre par des lacets le pied des falaises prisées des grimpeurs.<br><br></span><span>Le sentier balcon longe alors les falaises jusqu’à l<b>’Aiguillette d’Argentière</b>.</span><span>La partie câblée et équipée d’échelles débute juste après&nbsp;l’Aiguillette.</span><span>Une première série d’échelles est suivie par un passage en vire, puis de nouveau des échelles pour gagner une traversée facile sur un bon sentier.</span><span>La suite passe par une seconde série d’échelles, des marches et une main courante.</span><br><br>Ces difficultés passées, des lacets serrés mènent jusqu’à un grand cairn à la croisée de plusieurs chemins, notamment celui montant de <b>la Flégère.</b> Poursuivre en montant tout droit en direction du <b>lac Blanc</b> et lorsque le sentier part sur la gauche, grimper sur une bosse à droite pour découvrir les lacs inférieurs plus calmes que le lac supérieur situé sur le chemin montant au <b>lac blanc</b>, sous le chalet du <b>lac Blanc.<br><br><br></b>",
                            "creationDate": new Date(),
                            "modificationDate": new Date(),
                            "lastModifiedBy": 'Bob',
                            "spot_id" : spotId
                        }
                        db.collection('topos', function(err, collection) {
                            collection.insert(topo, {safe:true}, function(err, result) {
                                if (err) {
                                    res.send({'error':'An error has occurred'});
                                } else {
                                    //console.log('Success: ' + JSON.stringify(result[0]));
                                }
                            });
                        });
                        var data = {
                            table:
                            [     
                              {
                                key:'Difficulty',
                                value:'4',
                                type:'stars'
                              },
                              {
                                key:'Duration',
                                value:'4.5',
                                type:'h'
                              },
                              {
                                key:'Length',
                                value:'9',
                                type:'km'
                              },
                              {
                                key:'Map',
                                value:'IGN TOP25 3630 OT Chamonix',
                                type:'text'
                              },
                              {
                                key: 'Elevation',
                                value: '800',
                                type: 'm'
                              },
                              {
                                key: 'Starting elevation',
                                value: '1430',
                                type: 'm'
                              },
                              {
                                key: 'Highest Point',
                                value: '2211',
                                type: 'm'
                              }
                            ],
                            spot_id:spotId
                        };
                        db.collection('datas', function(err, collection) {
                            collection.insert(data, {safe:true}, function(err, result) {
                                if (err) {
                                    res.send({'error':'An error has occurred'});
                                } else {
                                    //console.log('Success: ' + JSON.stringify(result[0]));
                                }
                            });
                        });
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



