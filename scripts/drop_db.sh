#!/bin/sh
sudo -u postgres psql -c "DROP OWNED By acuser;"
sudo -u postgres dropuser acuser;
sudo -u postgres dropdb autocueillette_db
