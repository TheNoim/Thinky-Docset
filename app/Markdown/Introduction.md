# Introduction
## What is thinky?
`thinky` is a light [Node.js](https://nodejs.org/) ORM for [RethinkDB](https://www.rethinkdb.com/).  
It wraps the [rethinkdbdash](https://github.com/neumino/rethinkdbdash) driver and provides some extra features, like models, easy joins etc.  
The goal of `thinky` is to make retrieving/saving/deleting joined documents from RethinkDB as easy as possible.  
## What are the advantages of using thinky?
* **Less code to write**
    * It uses `rethinkdbdash` so you do not have to deal with connections.
    * It provides Models and handles joins in a nice and efficient way:
        * saving joined documents can be done with a single command: `saveAll`.
        * retrieving joined documents can be done with a single command: `getJoin`.
        * deleting joined documents can be done with a single command: `deleteAll`.
    * Tables are automatically created.
    * Indexes for joins are automatically created.
* **Fewer headaches**
    * It validates documents before saving them, which prevents you from saving incoherent data.
    * You do not have to remember the name of all your foreign keys.
    * Cursors are automatically coerced to arrays by default.
* **Easy to learn**
    * Chainable commands like in the driver.
    * All the commands available in the driver are also available with `thinky`.  


## What are the disadvantages of using thinky?  
Nothing that I can think of. It is basically sugar on top of the driver.  
## Awesome, where should I start?  
Take a look at:  
* The [quickstart](#Quickstart)
* The [examples on GitHub](https://github.com/neumino/thinky/tree/master/examples)
* The [API documentation](#API)