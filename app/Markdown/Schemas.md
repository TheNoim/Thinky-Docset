# Schemas
Schemas are structures that describe a Model. They are used to validate the data before saving it.  
It can also specify generate some default values if needed.  
A schema in thinky is define with an object that is passed to [thinky.createModel](#CreateModel). 
Each field of the object maps to a type. The valid types are:  
* `String`
* `Boolean`
* `Number`
* `Date`
* `Buffer`
* `Object` with `{...}`
* `Array` with `[...]`
* `"Point"`
* `"virtual"`  

There are two more ways to define a type, one is via the methods in `thinky.type` (referred as `thinky.type`). You can create the previous type this way:  
* `type.string()` for a `String`. Additional methods that you can chain for this type are:
    * `min(number)`: set the minimum length of the string
    * `max(number)`: set the maximum length of the string
    * `length(number)`: set the length of the string
    * `alphanum()`: requires the string to be alphanumeric (`[a-zA-Z0-9]`)
    * `regex(regex[, flags])`: requires the string to match the given regex
    * `email()`: requires the string to be an email
    * `lowercase()`: requires the string to be lowercase
    * `uppercase()`: requires the string to be uppercase
    * `enum(values...)` or `enum([enums])`: the possible values for this string
    * `uuid(version)`: requires the string to be a UUID (Supported versions: 3, 4 or 5)
* `type.boolean()` for a `Boolean`
* `type.number()` for a `Number`
    * `min(number)`: set the minimum acceptable value
    * `max(number)`: set the maximum acceptable value
    * `integer()`: requires the number to be an integer
* `type.date()` for a `Date`
    * `min(date)`: set the minimum acceptable value. Note that this will not be enforced for ReQL types like `r.now()`
    * `max(date)`: set the maximum acceptable value. Note that this will not be enforced for ReQL types like `r.now()`
* `type.buffer()` for a `Buffer`
* `type.object()` for an `Object`
* `type.array()` for an `Array`
* `type.point()` for a `"Point"`
* `type.virtual()` for a `"virtual"`
* `type.any()` for any type. No validation will be performed on this field.  
All these types come with a few more methods:  
* `required()`: set the field as required (cannot be `undefined`)
* `optional()`: set the field as optional (can be `undefined`)
* `allowNull(<boolean>)`: whether `null` is considered valid or not.
* `default(valueOrFunction)`: The first argument can be constant value or a function that will be called with the document as the context.
* `validator(fn)`: a function that will be used to validate a field before saving the document. The function should return `true` if the field is valid, `false` otherwise. The function can also throw an error.  

Objects have two extra methods:
* `allowExtra(<boolean>)`: whether we should allow extra fields and save them
* `removeExtra()`: remove the fields not defined in the schema before saving  

**Note:** About fields for joined documents:  
They should not be declared. The schema of the joined Model will be automatically used.  
**Note:** About dates:  
There are three valid values for a `Date`:
* A JavaScript Date object, like `new Date()`.
* A ReQL raw date object like:  
```json
{
    $reql_type$: "TIME",
    epoch_time: 1397975461.797,
    timezone:"+00:00"
}
```
* An ISO 8601 string like `"2014-04-20T06:32:18.616Z"`. 
  This format is the one used when you call `JSON.stringify` on a `Date` (or `toISOString`), which means you can serialize your data between the client and the server without having to worry about parsing the dates.  

**Note:** About points:  
You can pass a point as
* an array `[longitude, latitude]`
* an object `{longitude: <number>, latitude: <number>}`
* a ReQL object `r.point(longitude, latitude)`
* a GeoJson point `{type: "Point", coordinates: [longitude, latitude]}`  

For the moment, `thinky` supports only the geometry point. This is mostly because the most common case from far is to store locations are points, not polygons/lines.  
**Note:** About virtual fields:  
Virtual fields are not saved in the database and thinky will therefore not enforce any type on such fields.  
**Note:** About default values:  
The default value for a virtual field will be generated once all the other non-virtual values will have been generated. This is the only guarantee. A default value should not rely on another default value.  
*Example*: Create a basic Model for a `user`.  
```javascript
var type = thinky.type;
var User = thinky.createModel("User", {
    id: type.string(),
    name: type.string(),
    email: type.string(),
    age: type.number(),
    birthdate: type.date()
});
```  
**Note:** About validator:  
The reason behind the validator field is that you can import modules that are good at validating data like [validator](https://github.com/chriso/validator.js).  
*Example*: Create a model with nested fields.  
```javascript
var type = thinky.type;
var User = thinky.createModel("User", {
    id: type.string(),
    contact: {
        email: type.string(),
        phone: type.string()
    },
    age: type.number()
});
```  
Another way to do it is with:  
```javascript
var type = thinky.type;
var User = thinky.createModel("User", {
    id: type.string(),
    contact: type.object().schema({
        email: type.string(),
        phone: type.string()
    }),
    age: type.number()
});
```  
*Example*: Create a model where the field `scores` is an array of `Number`.
```javascript
var type = thinky.type;
var Game = thinky.createModel("Game", {
    id: type.string(),
    name: type.string(),
    scores: [type.number()]
});
```  
Another way to do it is with:  
```javascript
var type = thinky.type;
var Game = thinky.createModel("Game", {
    id: type.string(),
    name: type.string(),
    scores: type.array().schema(type.number())
});
```  
*Example*: Create a model where the field `game` is an array of objects with two fields — `score` and `winner`.  
```javascript
var type = thinky.type;
var Game = thinky.createModel("Game", {
    id: type.string(),
    name: type.string(0,
    game: [{
        score: type.number(),
        winner: type.string()
    }]
});
```
You can also do the same with:  
```javascript
var type = thinky.type;
var Game = thinky.createModel("Game", {
    id: type.string(),
    name: type.string(),
    game: type.array().schema(type.object().schema({
        score: Number,
        winner: String
    }))
});
```  
*Example*: Create a model for a post where the default value for `createdAt` is the current date if not specified.  
```javascript
var type = thinky.type;
var Post = thinky.createModel("Post",{
    id: type.string(),
    title: type.string(),
    content: type.string(),
    createdAt: type.date().default(r.now())
});
```  
*Example*: Create a model for a user where the nickname, if not defined, will be its first name.  
```javascript
var type = thinky.type;
var Post = thinky.createModel("Post",{
    id: type.string(),
    firstname: type.string(),
    lastname: type.string(),
    nickname: type.string().default(function() {
        return this.firstname;
    }}
});
```  
*Example*: Create a model for a `post` where the field `title` must be a `String` (where `null` will not be a valid value).  
```javascript
var type = thinky.type;
var Post = thinky.createModel("Post",{
    id: type.string(),
    title: type.string().options({enforce_type: "strict"}),
    content: type.string(),
    createdAt: type.string().default(r.now())
});
```
*Example*: Create a model `User` and make sure that the field email is a valid email using [validator](https://github.com/chriso/validator.js)  
```javascript
var type = thinky.type;
var validator = require('validator');

var User = thinky.createModel("Users",{
    id: type.string(),
    email: type.string().validator(validator.isEmail)
    age: type.number()
});
```  
