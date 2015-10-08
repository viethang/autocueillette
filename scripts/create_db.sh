#!/bin/sh

if [ -z "$PASS" ]
then
  echo "Must provide a password with PASS=something environnement variable"
  echo "A ~/.pgpass will be created (overwriting any existing one)"
  return 1
fi

sudo -u postgres createdb autocueillette_db
sudo -u postgres psql <<EOF
  CREATE USER acuser WITH PASSWORD '$PASS';
  GRANT ALL ON ALL TABLES IN SCHEMA public TO acuser;
  ALTER DEFAULT PRIVILEGES FOR ROLE acuser IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO acuser;
EOF

echo "localhost:*:autocueillette_db:acuser:$PASS" > ~/.pgpass
chmod go-rwx ~/.pgpass
