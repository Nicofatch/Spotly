var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , async   = require('async')
  , engine = require('ejs-locals')
  , maps = require('./api/maps')
  , spots = require('./api/spots')
  , comments = require('./api/comments')
  , pictures = require('./api/pictures')
  , tags = require('./api/tags')
  , pass = require('./config/pass')
  , passport = require('passport')
  , user_routes = require('./routes/user')
  , basic_routes = require('./routes/basic');

Constants = require('./constants');

var app = express();

// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon(path.join(__dirname, 'public/img/favicon.ico')));
app.use(express.logger("dev"));
app.use(express.cookieParser());
app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(allowCrossDomain);

// Site navigation requests
app.get('/',basic_routes.app);
// app.get('/maps',pass.ensureAuthenticated,basic_routes.maps);
// app.get('/login',user_routes.getLogin);
// app.post('/login',user_routes.postLogin);
// app.get('/logout',user_routes.logout);
// app.get('/explore',basic_routes.explore);
// app.get('/spot',basic_routes.spot);

// API requests
app.get('/api/maps',maps.findAll);
app.get('/api/maps/:id',maps.findById);
app.post('/api/maps',maps.add);
app.put('/api/maps/:id',maps.update);
app.delete('/api/maps/:id',maps.delete);

app.get('/api/tags',tags.findAll);
app.get('/api/tags/search',tags.findByValue);
app.get('/api/tags/:id',tags.findById);
app.post('/api/tags',tags.add);
app.put('/api/tags/:id',tags.update);
app.delete('/api/tags/:id',tags.delete);

app.get('/api/spots/generate', spots.generate);

app.get('/api/spots/:k/:lng/:lat',spots.search);
app.put('/api/spots/:id',spots.update);
app.get('/api/spots/:id',spots.findById);
app.get('/api/spots/:id/comments',comments.findBySpotId);

app.post('/api/comments',comments.add);

app.post('/api/pictures',pictures.add);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
