#!/bin/sh
sudo -u postgres createdb autocueillette_db
sudo -u postgres psql <<EOF
  CREATE USER acuser WITH PASSWORD '$PASS';
  GRANT ALL ON ALL TABLES IN SCHEMA public TO acuser;
  ALTER DEFAULT PRIVILEGES FOR ROLE acuser IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO acuser;
EOF
