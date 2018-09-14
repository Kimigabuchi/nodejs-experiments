var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('lib/log')(module);

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
app.use(app.router);

app.get('/', function(req, res, next) {
  res.render("index");
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler()
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'chat';
const collectionName = "test_insert";

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  removeDocument(db, function() {
    insertDocuments(db, function() {
      findDocuments(db, function() {
        client.close();
      });
    });
  })

});

const removeDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  collection.deleteMany({}, function(err, res) {
    callback(res);
  })
}


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
  collection.find({}).toArray(function(err, docs) {
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