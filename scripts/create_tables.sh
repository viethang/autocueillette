#!/bin/sh
sudo -u postgres psql autocueillette_db <<EOF
CREATE EXTENSION postgis;

CREATE TABLE farm (
  id serial PRIMARY KEY,
  name varchar(50),
  phone text,
  street varchar(100),
  city varchar(50),
  canton varchar(50),
  country varchar(50),
  products text,
  coordinates geography(POINT, 4326),
  lat float,
  lon float,
  author text,
  date timestamp
);

CREATE TABLE farm_comment (
  id serial PRIMARY KEY,
  farm_id int references farm(id),
  message text,
  author text,
  date timestamp
);

CREATE TABLE farm_archive (
  id serial PRIMARY KEY,
  farm_id int references farm(id),
  name varchar(50),
  phone text,
  street varchar(100),
  city varchar(50),
  canton varchar(50),
  country varchar(50),
  coordinates geography(POINT, 4326),
  lat float,
  lon float,
  author text,
  date timestamp
);


EOF
