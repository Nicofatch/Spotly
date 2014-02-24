var fs = require('fs')
  , express = require('express')
  , http    = require('http')
  , https = require('https')
  , path    = require('path')
  , async   = require('async')
  , engine = require('ejs-locals')
  , maps = require('./api/maps')
  , spots = require('./api/spots')
  , comments = require('./api/comments')
  , topos = require('./api/topos')
  , datas = require('./api/datas')
  , pictures = require('./api/pictures')
  , tags = require('./api/tags')
  , security = require('./config/security')
  , passport = require('passport')
  , user_routes = require('./routes/user')
  , basic_routes = require('./routes/basic')
  , xsrf = require('./lib/xsrf')
  , protectJSON = require('./lib/protectJSON')
  , security = require('./config/security')

//var privateKey  = fs.readFileSync(__dirname + '/cert/privatekey.pem').toString();
//var certificate = fs.readFileSync(__dirname + '/cert/certificate.pem').toString();
//var credentials = {key: privateKey, cert: certificate};

Constants = require('./constants');
//require('express-namespace');

var app = express();
//var secureServer = https.createServer(credentials, app);
var server = http.createServer(app);

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
//app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.cookieSession({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(allowCrossDomain);
app.use(protectJSON);
app.use(xsrf);

// Initialize security
security.initialize();

/*app.use(function(req, res, next) {
  if ( req.user ) {
    console.log('Current User:', req.user.username);
  } else {
    console.log('Unauthenticated');
  }
  next();
});*/

// Site navigation requests
app.get('/',basic_routes.app);
// app.get('/maps',pass.ensureAuthenticated,basic_routes.maps);
// app.get('/login',user_routes.getLogin);
app.post('/login',security.login);
app.post('/logout',security.logout);
// app.get('/logout',user_routes.logout);
// app.get('/explore',basic_routes.explore);
// app.get('/spot',basic_routes.spot);
app.get('/current-user',user_routes.currentUser);
app.get('/authenticated-user',user_routes.authenticatedUser);
app.get('/admin-user',user_routes.adminUser);


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
app.get('/api/spots/:id/topo',topos.findBySpotId);
app.get('/api/spots/:id/data',datas.findBySpotId);

app.post('/api/comments',comments.add);

app.put('/api/topos/:id',topos.update);
app.put('/api/datas/:id',datas.update);

app.post('/api/pictures',pictures.add);

app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

var port = process.env.PORT || 5000;
var securePort = process.env.SECURE_PORT || 443;

server.listen(port, function() {
  console.log("Listening on " + port);
});
//secureServer.listen(securePort);
//console.log('Listening on secure port ' + securePort);
