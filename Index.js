const sqlite3 = require('sqlite3').verbose();
const fs = require('fs-extra-promise');
const inliner = require('html-inline')

const Index = [
    {
        type: "Guide",
        name: "Quickstart",
        path: "index.html#Quickstart"
    },
    {
        type: "Guide",
        name: "Introduction",
        path: "index.html#Introduction"
    },
    {
        type: "Section",
        name: "What is thinky?",
        path: "index.html#what-is-thinky-"
    },
    {
        type: "Section",
        name: "Advantages of using thinky",
        path: "index.html#what-are-the-advantages-of-using-thinky-"
    },
    {
        type: "Section",
        name: "API Documentation",
        path: "index.html#API"
    },
    {
        type: "Section",
        name: "Where should I start?",
        path: "index.html#awesome-where-should-i-start-"
    },
    {
        type: "Guide",
        name: "Importing thinky",
        path: "index.html#ImportingThinky"
    },
    {
        type: "Guide",
        name: "Schemas",
        path: "index.html#Schemas"
    },
    {
        type: "Guide",
        name: "Relations",
        path: "index.html#Relations"
    },
    {
        type: "Section",
        name: "Save documents",
        path: "index.html#save-documents"
    },
    {
        type: "Section",
        name: "Delete documents",
        path: "index.html#delete-documents"
    },
    {
        type: "Section",
        name: "Retrieve documents",
        path: "index.html#retrieve-documents"
    },
    {
        type: "Guide",
        name: "Virtual fields",
        path: "index.html#VirtualFields"
    },
    {
        type: "Guide",
        name: "Changefeeds",
        path: "index.html#Changefeeds"
    },
    {
        type: "Section",
        name: "Range feeds",
        path: "index.html#range-feeds"
    },
    {
        type: "Section",
        name: "Point feeds",
        path: "index.html#point-feeds"
    },
    {
        type: "Section",
        name: "API",
        path: "index.html#API"
    },
    {
        type: "Category",
        name: "thinky",
        path: "index.html#thinky"
    },
    {
        type: "Guide",
        name: "Import",
        path: "index.html#import"
    },
    {
        type: "Instance",
        name: "thinky.r",
        path: "index.html#thinky-r"
    },
    {
        type: "Class",
        name: "thinky.Errors",
        path: "index.html#thinky-errors"
    },
    {
        type: "Class",
        name: "ThinkyError",
        path: "index.html#thinky-errors"
    },
    {
        type: "Error",
        name: "DocumentNotFound",
        path: "index.html#thinky-errors"
    },
    {
        type: "Error",
        name: "InvalidWrite",
        path: "index.html#thinky-errors"
    },
    {
        type: "Error",
        name: "ValidationError",
        path: "index.html#thinky-errors"
    },
    {
        type: "Instance",
        name: "thinky.Query",
        path: "index.html#thinky-query"
    },
    {
        type: "Method",
        name: "thinky.createModel",
        path: "index.html#thinky-createmodel"
    },
    {
        type: "Method",
        name: "thinky.dbReady",
        path: "index.html#thinky-dbready"
    }
];
let db;

fs.removeAsync('./ThinkyIO.docset').then(() => {
    return fs.ensureDirAsync('./ThinkyIO.docset/Contents/Resources/Documents/');
}).then(() => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./ThinkyIO.docset/Contents/Resources/docSet.dsidx', function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}).then(() => {
    return new Promise((resolve, reject) => {
        db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);', function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}).then(() => {
    return new Promise((resolve, reject) => {
        db.run('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);', function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}).then(() => {
    return Promise.resolve(Index);
}).map(function (SQLData) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('${SQLData.name}', '${SQLData.type}', '${SQLData.path}');`, function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}).then(() => {
    return new Promise((resolve, reject) => {
        db.close(function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}).then(() => {
    console.log("Index finished");
    return Promise.resolve();
}).then(() => {
    return fs.copyAsync('./dist', './ThinkyIO.docset/Contents/Resources/Documents')
}).then(() => {
    return fs.copyAsync('./Info.plist', './ThinkyIO.docset/Contents/Info.plist');
}).then(() => {
    console.log("Files copied.");
});