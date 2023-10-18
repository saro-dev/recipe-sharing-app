express-cache-headers
=====================
An Express middleware for setting response cache headers

###Usage
    var express = require('express');
    var app = express();

    var cache = require('express-cache-headers');

    app.use(cache(10));

    app.get('/hi', cache({nocache:true}), function(req, res){
        res.send('Hi');
    });

    app.get('/hey', cache({ttl:300, private:true}), function(req, res){
        res.send('Hey');
    });

###Options
    ttl - seconds - defaults to 0
    nocache - true/false - default to false
    private - true/false - default to false
    mustrevalidate - true/false - default to false
