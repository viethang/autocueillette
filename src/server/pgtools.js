var pg = require('pg');

var conString = 'postgres://acuser@localhost/autocueillette_db';

module.exports.getFarm = getFarm;
module.exports.checkFarmInDb = checkFarmInDb;
module.exports.searchFarms = searchFarms;
module.exports.updateFarm = updateFarm;
module.exports.addNewFarm = addNewFarm;

function getFarm(id, callback) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            callback(err);
            console.log('connection error', err);
            return;
        }
        client.query('SELECT * FROM farm WHERE id = $1', [id], function(err, result) {
            done();
            if (err) {
                callback(err);
                console.log('error running query', err);
                return;
            }
            callback(false, result.rows[0]);
        });
    });
}

function checkFarmInDb(farm, callback) {
    var res = {exists: 0};
    pg.connect(conString, function(err, client, done) {
        if (err) {
            callback(err);
            console.log('connection error', err);
            return;
        }
        /*First check if the address matches some existing farm*/
        client.query('SELECT id FROM farm WHERE canton = $1 AND country = $2 AND city = $3 and street = $4', [farm.canton, farm.country, farm.city, farm.street], function(err, match_result) {
            if (err) {
                callback(err);
                console.log('error running query', err);
                return;
            }
            var data = match_result.rows;
            if (data.length) { /*Matches a farm in database, return the id*/
                res.exists = 1;
                res.id = data[0].id;
                callback(false, res);
                return;
            }
            /*If no matched farm address, find close farm in the same city*/
            client.query('SELECT * FROM farm WHERE city= $1 AND canton = $2 AND country = $3 AND ST_DISTANCE(coordinates, ST_Point($4, $5)) < 5000', [farm.city, farm.canton, farm.country, farm.lat, farm.lon], function(err, close_result) {
                done();
                if (err) {
                    callback(err);
                    console.log('error running query', err);
                    return;
                }
                var closeFarms = close_result.rows;
                if (closeFarms.length > 0) {
                    res.closeFarms = closeFarms;
                }
                callback(false, res);
            });
        });
    });
}

function searchFarms(data, callback) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            callback(err);
            console.log('connection error', err);
            return;
        }
        var products;
        var lat = data.coordinates[0];
        var lon = data.coordinates[1];
        var query;
        var dist = 50000; /*default search radius*/
        if (data.products) {
            products = data.products.match(/\w+|"(?:\\"|[^"])+"/g); /*Split string 'salade "haricot vert"' into ['salade', 'haricot vert']*/
            products = products.map(function(product) {
                return product.replace(/\"/g, '\'');
            }); /*replace " by ' to use in to_tsquery*/ 
            query = products.join('|');
            /*Order search result according to relevance in products then to the distance*/ 
            client.query('SELECT * FROM farm, ST_DISTANCE(coordinates, ST_Point($1, $2)) distance WHERE to_tsvector(products) @@ to_tsquery($3) AND distance < $4 ORDER BY ts_rank_cd(to_tsvector(products), to_tsquery($3)) DESC, distance ASC', [lat, lon, query, dist], function(err, result) {
                done();
                if (err) {
                    callback(err);
                    console.log('error running query', err);
                    return;
                }
                callback(false, result.rows);
            });
            return;
        }
        /*If no product specified, search for all farm in a radius of dist, order by distance*/ 
        client.query('SELECT * FROM farm, ST_DISTANCE(coordinates, ST_Point($1, $2)) distance WHERE distance < $3 ORDER BY distance ASC', [lat, lon, dist], function(err, result) {
            done();
            if (err) {
                callback(err);
                console.log('error running query', err);
                return;
            }
            callback(false, result.rows);
        });
    });
}

function updateFarm(farm, callback) {
    console.log('id', farm.id);
    pg.connect(conString, function(err, client, done) {
        if(err) {
            callback(err);
            console.log('connection error', err);
            return;
        }
        client.query('UPDATE farm SET phone = $1, products = $2, name = $3 WHERE id = $4', [farm.phone, farm.products, farm.name, farm.id], function(err, result) {
            done();
            if (err) {
                callback(err);
                console.log('update query error', err);
                return;
            }
            callback(false);
        });
    });
}

function addNewFarm(farm, callback) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            callback(err);
            console.log('add new farm error', err);
            return;
        }
        client.query('INSERT INTO farm (name, phone, city, canton, country, products,author, coordinates, lat, lon, date) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, ST_SetSRID(ST_Point($8::float, $9::float),4326)::geography, $8::float, $9::float, now()) returning id;', [
        farm.name, farm.tel, farm.city, farm.canton, farm.country, farm.product, 'TODO', farm.lat, farm.lon], function(err, result) {
            done();
            if(err) {
                callback(err);
                console.log('insert query error', err);
                return;
            }
            callback(false, result.rows[0].id);
        });
    });
}
