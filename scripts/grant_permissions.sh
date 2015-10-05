#!/bin/sh
sudo -u postgres psql autocueillette_db <<EOF
GRANT ALL ON farm,farm_archive,farm_comment,farm_id_seq to acuser;
EOF
