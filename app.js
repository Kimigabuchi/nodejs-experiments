var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('lib/log')(module);
var mongoose = require('lib/mongoose');
var HttpError = require('error').HttpError;

var app = express();

app.engine('ejs', require('ejs-locals'))
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

app.use(express.favicon());
if (app.get('env') == 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}
app.use(express.bodyParser());

app.use(express.cookieParser());

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongoose_connection: mongoose.connection})
}));

app.use(function(req, res, next) {
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  res.send("Visits: " + req.session.numberOfVisits);
});

app.use(require('middleware/sendHttpError'));

app.use(app.router);

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'chat';
// const collectionName = "test_insert";

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);
//   removeDocument(db, function() {
//     insertDocuments(db, function() {
//       findDocuments(db, function() {
//         client.close();
//       });
//     });
//   })

// });

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');

// const schema = mongoose.Schema({
//   name: String
// });
// schema.methods.meow = function() {
//   console.log(this.get('name'));
// }

// const removeDocument = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection(collectionName);
//   collection.deleteMany({}, function(err, res) {
//     callback(res);
//   })
// }


const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  let cursor = collection.find({})
  cursor.toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
// var routes = require('./routes');
// var user = require('./routes/user');

// // all environments


// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

// app.get('/', routes.index);
// app.get('/users', user.list);



http.createServer(app).listen(config.get('port'), function(){
  log.info("Express server listening on port " + config.get('port'));
});

// const mongoose = require('lib/mongoose');
// mongoose.set('debug', true);
// const async = require('async');


// async.series([
//   open,
//   dropDatabase,
//   requireModels,
//   createUsers
// ], function(err, result) {
//   console.log(arguments);
//   mongoose.disconnect();
//   process.exit(err ? 255 : 0);
// });

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
  const db = mongoose.connection.db;
  db.dropDatabase(callback);
}

function requireModels(callback) {
  require('models/user');
  async.each(Object.keys(mongoose.models), function(modelName, callback) {
    mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

function createUsers(callback) {
  require('models/user');

  var users = [
    {username: 'Вася', password: 'supervasya'},
    {username: 'Петя', password: '123'},
    {username: 'admin', password: 'thetruehero'}
  ];

  async.each(users, function(userData, callback) {
    var user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);
}