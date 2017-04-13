# API

## thinky

### Import

```javascript
var thinky = require('thinky')([options]);
var r = thinky.r;
```

The `options` argument is optional and can have the fields:

* Options for the drivers:
    * `max`: the maximum number of connections in the pool, default `1000`
    * `buffer`: the minimum number of connections available in the pool, default `50`
    * `timeoutError`: number of milliseconds before reconnecting in case of an error, default `1000`
    * `timeoutGb`: number of milliseconds before removing a connection that has not been used, default `60*60*1000`
    * `host`: host of the RethinkDB server, default `"localhost"`
    * `port`: client port of the RethinkDB server, default `28015`
    * `db`: the default database, default `"test"`
    * `user`/`password`: the user/password to access the database.
* Options for the schemas
    * `validate`: can be `"onsave"` or `"oncreate"`. The default value is `"onsave"`
    * `timeFormat`: can be `"native"` or `"raw"`. The default value is `"native"`
    * `r`: An instance of `rethinkdbdash`
* Global options
    * `createDatabase`: A boolean to indicate if thinky should create the database, default `true`.


All the options for the schemas can be overwritten when creating them.

_Note_: If you import `thinky` multiple times, the models will not be shared between instances.

___

### thinky.r

```javascript
var thinky = require('thinky')();
var r = thinky.r;
```

The `thinky` object keeps a reference to the driver in the property `r`.

_Example_: You need a reference to `r` to specify a descending order.

```javascript
var p = Post.orderBy({index: r.desc("createdAt")}).run()
```

_Example_: You need a reference to `r` to build a sub-query/predicate.

```javascript
var p = Post.filter(function(post) {
    return r.expr([1,2,3,4]).contains(post("id"))
}).run()
```

_Example_: You can use `r` to run any query like you would with the driver.

```javascript
var p = r.table("posts").count().run()
```

___

### thinky.Errors
    
```javascript
var thinky = require('thinky')();
var Errors = thinky.Errors;
```

All operational errors created by Thinky are sub classes of `ThinkyError`.

Currently `thinky` will throw the following errors:

* `DocumentNotFound` is thrown when a `get` call returns `null` instead of a document.
* `InvalidWrite` is thrown when an in place upgrade/replace returns a non-valid document.
* `ValidationError` is thrown when the schema validation of a document fails. Read more about the schema and validation on [this article](http://thinky.io/documentation/schemas/).

_Example_: Retrieve a document with its primary key and print a message if the document was not found.

```javascript
Post.get(1).run().then(function(post) {
    // Do something with the post
}).catch(Errors.DocumentNotFound, function(err) {
    console.log("Document not found");
}).error(function(error) {
    // Unexpected error
});
```

_Example_: Saving an object that breaks schema validation and printing the cause of the validation error.

```javascript
var User = thinky.createModel("User", {
    id: type.string(),
    name: type.string(),
    email: type.string().email() // <-- Valid e-mail address required
});

User.save({
    name: "Jessie",
    email: "555-1234" // <-- Not an e-mail address
}).then(function(result) {
    // Skipped due to ValidationError
}).catch(Errors.ValidationError, function(err) {
    console.log("Validation Error: " + err.message)
}).error(function(error) {
    // Unexpected error
});
```

___

### thinky.Query

```javascript
var thinky = require('thinky')();
var r = thinky.r;
var Query = thinky.Query;
```

Let you create a query that does not start with `r.table("...")`.

_Example_: Create a query that returns `Users`.

```javascript
var query = new Query(User, r);
query.expr([1,2,3]).map(function(id) {
    return r.table(User.getTableName()).get(id)
}).run().then(function(result) {
    // result is an array of Users
}).error(console.log);
```

___

### thinky.createModel

```javascript
var model = thinky.createModel(tableName, schema, options);
```

Create a model.

The arguments are:

* tableName is the name of the table used for the model. 
  It must be a string composed of `[a-zA-Z0-0_]`. 
  Two models cannot be created with the same `tableName`.
* `schema` which must be a valid schema.
  Read more about schemas on [this article](#Schemas)
* `options` can be an object with the fields:
    * `pk`: the primary key of the table. 
      If the primary key is not `"id"`, the `pk` field is **mandatory**.
    * `enforce_missing`: `Boolean`, `true` to forbid missing fields, default `"false"`.
    * `enforce_extra`: can be `"strict"`, `"remove"` (delete the extra fields on validation), `"none"`, default `"none"`
    * `enforce_type`: can be `"strict"`, `"loose"` or `"none"`.
    * `validator`: A function that will be used to validate a document before saving it. The context is set to the whole document.
    * `table`: an `object` that will be used to create the table, useful to set replicas, shards etc.
    

Read more about `enforce_missing`/`enforce_extra`/`enforce_type` on [the article](#Schemas) about schemas.

_Example_: Create a basic Model for a `user`.

```javascript
var User = thinky.createModel("User", {
    id: type.string(),
    name: type.string(),
    email: type.string(),
    age: type.number(),
    birthdate: Date
})
```

_Example_: Create a model with nested fields

```javascript
var User = thinky.createModel("User", {
    id: type.string(),
    contact: {
        email: type.string(),
        phone: type.string()
    },
    age: type.number()
});
```

_Example_: Create a model where the field `"scores"` is an array of `Number`.

```javascript
var Game = thinky.createModel("Game", {
    id: type.string(),
    name: type.string(),
    scores: [type.number()]
});
```

_Example_: Create a model for a post where the default value for `createdAt` is the current date if not specified.

```javascript
var Post = thinky.createModel("Post",{
    id: type.string(),
    title: type.string(),
    content: type.string(),
    createdAt: type.date().default(r.now())
});
```

_Example_: Create a model for a user where the nickname, if not defined, will be its first name.

```javascript
var Post = thinky.createModel("Post",{
    id: type.string(),
    firstname: type.string(),
    lastname: type.string(),
    nickname: type.string().default(function() {
        return this.firstname;
    })
});
```

_Example_: Create a model for a `post` where the field `title` must be a `String` (where `null` will not be a valid value).

```javascript
var Post = thinky.createModel("Post",{
    id: type.string(),
    title: {_type: type.string(), enforce_type: "strict"},
    content: type.string(),
    createdAt: type.date().default(r.now())
});
```

___

### thinky.dbReady

```javascript
var promise = thinky.dbReady();
```

Return a promise that will be resolved when the database is available.

___

## Model

A model is returned from (thinky.createModel)[#createmodel]

### getTableName

```javascript
Model.getTableName();
```

Return the name of the table used for this model.

Example: Return the name of table used for `PostModel`.

```javascript
var PostModel = thinky.createModel("Post", {
    id: type.string(),
    title: type.string(),
    author: type.string()
});

PostModel.getTableName(); // returns "Post"
```

___

### define

```javascript
Model.define(key, fn);
```

Define a function that documents will be available for documents of this Model.

_Example_: Add a method `isAdult` on `Users`.

```javascript
var User = thinky.createModel("User", {
    id: type.string(),
    age: type.number()
});

User.define("isAdult", function() {
    return this.age > 18;
});

var kid = new User({age: 12});
kid.isAdult(); // false

var grownup = new User({age: 23});
grownup.isAdult(); // true
```