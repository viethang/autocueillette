#!/bin/sh
sudo -u postgres psql autocueillette_db <<EOF
DROP TABLE contributor;
DROP TABLE farm_archive;
DROP TABLE farm_comment;
DROP TABLE farm;
DROP EXTENSION postgis;
EOF
