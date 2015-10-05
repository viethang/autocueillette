#!/bin/sh
psql -Uacuser -h localhost autocueillette_db <<EOF
select name, city, products, ST_ASTEXT(coordinate), ST_DISTANCE(coordinate, ST_GeographyFromText('SRID=4326;POINT(46.533333 6.583333)'))
FROM farm
WHERE
  ST_DISTANCE(coordinate, ST_GeographyFromText('SRID=4326;POINT(46.533333 6.583333)')) < 20000
  AND products like '%salade%';
EOF
