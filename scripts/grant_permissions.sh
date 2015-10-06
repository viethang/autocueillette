#!/bin/sh
sudo -u postgres psql autocueillette_db <<EOF
GRANT ALL ON farm,farm_archive,farm_comment, farm_comment_id_seq, farm_id_seq, farm_archive_id_seq, contributor to acuser;
EOF
