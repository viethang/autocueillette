var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var pgtools = require('./pgtools');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/assets', express.static('assets'));
app.use('/vendor', express.static('vendor'));
app.use('/src/client', express.static('src/client'));

var serverReversedPath = '../..';

var servedFiles = ['/index.html', '/templates-app.js', '/templates-common.js'];

servedFiles.forEach(function(url) {
    serveFile(url);
});

app.post('/addNewFarm', function(req, res, next) {
    var farm = req.body;
    pgtools.addNewFarm(farm, function(err, id) {
        if(err) {
            res.send({err: err});
            return;
        }
        res.send({id: id});
        console.log('add farm success');
        /*Add farm to farm_archive*/
        pgtools.addFarmToArchive(farm, function(err) {
            if (err) {
                return;
            }
            console.log('add to archive success');
        });
    });
});

app.post('/getFarm', function(req, res) {
    var id = req.body.id;
    pgtools.getFarm(id, function(err, result) {
        if (err) {
            res.send({err: err});
            return;
        }
        res.send({farmInfo: result});
        console.log('get farm success');
    });
});

app.post('/updateFarm', function(req, res) {
    var farm = req.body;
    pgtools.getFarm(farm.id, function(err, result) { /*result = farm in database*/
        if (err) {
            res.send({err: err});
            return;
        }
        /* Check if farm infos are changed*/
        var oldFarm = result;
        var same = true;
        var props = ['name', 'phone', 'products'];
        var prop;
        for (var i = 0; i < props.length; i++) {
            prop = props[i];
            if (farm[prop] !== oldFarm[prop]) {
                same = false;
            }
        }
        if (same) {return;}

        /* Farm infos are changed, update farm and farm_archive*/
        pgtools.updateFarm(farm, function(err) {
            if (err) {
                res.send({err: err});
                return;
            }
            res.send();
            console.log('update success');
            pgtools.addFarmToArchive(farm, function(err) {
                if (err) {
                    return;
                }
                console.log('add to archive success');
            });
        });
    });
});

app.post('/searchFarms', function(req, res) {
    var data = req.body;
    pgtools.searchFarms(data, function(err, body) {
        if (err) {
            res.send({err: err});
            return;
        }
        res.send(body);
    });
});

app.post('/newFarm/checkDb', function(req, res) {
    var farm = req.body;
    pgtools.checkFarmInDb(farm, function(err, body) {
        if (err) {
            res.send({err: err});
            return;
        }
        res.send(body);
    });
});

app.get('/getFarmHistory', function(req, res) {
    var id = req.query.id;
    pgtools.getFarmHistory(id, function(err, rows) {
        if (err) {
            res.send({err: err});
            return;
        }
        res.send(rows);
        console.log('get farm history success');
    });
});

app.get('/getComments', function(req, res) {
    var id = req.query.id;
    pgtools.getComments(id, function(err, rows) {
        if (err) {
            res.send({err: err});
            return;
        }
        res.send(rows);
        console.log('get comments success');
    });
});

app.post('/postComment', function(req, res) {
    pgtools.postComment(req.body, function(err, comment_id) {
        if (err) {
        res.send({err: err});
            return;
        }
        res.send({comment_id: comment_id});
        console.log('post comment success', comment_id);
    });
});

app.use(function(req, res) {
    console.log(req.url, 'File not found! Send index.html');
    res.sendFile(path.join(__dirname, serverReversedPath, '/index.html'));
});

app.use(function(err, req, res) {
    res.end('Error!', err.toString());
});

http.createServer(app).listen(8000);

function serveFile(url) {
    app.get(url, function(req, res, next) {
        res.sendFile(path.join(__dirname, serverReversedPath, url));
    });
}