const User = require('models/user').User;

const user = new User({
  username: "Tester",
  password: "secret"
});

user.save(function(err, user, affected) {
  if (err) throw err;
  console.log(arguments);
});

// schema.methods.meow = function() {
//   console.log(this.get('name'));
// }

// const Cat = mongoose.model('Cat', schema);

// const kitty = new Cat({
//   name: 'Zildjian',
// });

// kitty.save(function(err, product, affected) {
//   product.meow();
// });

// // var User = require('models/user').User;

// // var user = new User({
// //   username: "Tester3",
// //   password: "secret"
// // });

// // user.save(function(err, user, affected) {
// //   console.log(1);
// //   if (err) throw err;
// //   console.log('OK');
// //   User.findOne({username: "Tester3"}, function(err, tester) {
// //     console.log(tester);
// //   });
// // });

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

// const removeDocument = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection(collectionName);
//   collection.deleteMany({}, function(err, res) {
//     callback(res);
//   })
// }


// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection(collectionName);
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }

// const findDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection(collectionName);
//   // Find some documents
//   let cursor = collection.find({})
//   cursor.toArray(function(err, docs) {
//     assert.equal(err, null);
//     console.log("Found the following records");
//     console.log(docs)
//     callback(docs);
//   });
// }