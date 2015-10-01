1. $ npm install
2. $ bower install


3. Install couchdb
	$ apt-get install couchdb
4.	Run couchdb
	$ couchdb_install_directory/bin/couchdb
5. Create couchdb database: from project directory run
	$ nodejs couchdb.config.js

6. Install solr (download from Apache's website)

7. Configure solr
	- $ solr_directory/bin/solr create -c autocueillette -d basic_configs
	- replace files schema.xml and solrconfig.xml in server/solr/autocueillette/config/ by files schema.xml and solrconfig.xml from the cloned project.
