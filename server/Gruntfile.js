var db = require('./config/dbschema'),
    connection = require('./api/connection.js');

var db2=connection.db;
var BSON=connection.BSON;

module.exports = function(grunt) {

  grunt.registerTask('dbseed', 'seed the database', function() {
    grunt.task.run('dbdrop');
    grunt.task.run('adduser:admin:admin@example.com:secret:true');
    grunt.task.run('adduser:bob:bob@example.com:secret:false');
    grunt.task.run('addspots');
    grunt.task.run('createspotsindex');
  });

  grunt.registerTask('createspotsindex', 'creates spots search index', function(){
    // save call is async, put grunt into async mode to work
    var done = this.async();
    db2.collection('spots', function(err, collection) {
      collection.ensureIndex({loc: "2d"},function(err,result){
        if (err) {
          console.log('Error while creating index:' + err);
          done(false);
        } else {
          console.log('Successfully created index');
          done();
        }
      });
    });
  });

  grunt.registerTask('adduser', 'add a user to the database', function(usr, emailaddress, pass, adm) {
    // convert adm string to bool
    adm = (adm === "true");

    var user = new db.userModel({ username: usr
          , email: emailaddress
          , password: pass
          , admin: adm });
    
    // save call is async, put grunt into async mode to work
    var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved user: ' + user.username);
        done();
      }
    });
  });

  grunt.registerTask('addspots', 'populate the spot db', function() {
    // save call is async, put grunt into async mode to work
    var done = this.async();

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
                "likes": [],
                "address": {
                  value:"4, Place de Damloup, 31000 Toulouse, France",
                  type:"address"
                }
            };

            db2.collection('spots', function(err, collection) {
                collection.insert(item, {safe:true}, function(err, result) {
                    if (err) {
                        console.log('Error: ' + err);
                        done(false);
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
                        db2.collection('topos', function(err, collection) {
                            collection.insert(topo, {safe:true}, function(err, result) {
                                if (err) {
                                    console.log('Error: ' + err);
                                    done(false);
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
                        db2.collection('datas', function(err, collection) {
                            collection.insert(data, {safe:true}, function(err, result) {
                                if (err) {
                                    //res.send({'error':'An error has occurred'});
                                    console.log('Error: ' + err);
                                    done(false);
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
        db2.collection('tags', function(err, collection) {
            collection.insert(tag, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error: ' + err);
                    done(false);
                } else {
                    
                }
            });
        });
    }
    done();
  });

  grunt.registerTask('dbdrop', 'drop the database', function() {
    // async mode
    var done = this.async();

    db.mongoose.connection.on('open', function () { 
      db.mongoose.connection.db.dropDatabase(function(err) {
        if(err) {
          console.log('Error: ' + err);
          done(false);
        } else {
          console.log('Successfully dropped db');
          done();
        }
      });
    });
  });

};
