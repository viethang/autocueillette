.DEFAULT_GOAL := serve

node_modules:
	npm install

vendor/angular: node_modules
	node_modules/.bin/bower install

node_modules/openlayers/build/ol.js: vendor/angular
	cd node_modules/openlayers ; make build ; cd ../..

vendor/openlayers: node_modules/openlayers/build/ol.js
	mkdir -p vendor/openlayers
	cp node_modules/openlayers/build/ol.js node_modules/openlayers/build/ol.css node_modules/openlayers/build/ol-debug.js vendor/openlayers

serve: vendor/openlayers
	node_modules/.bin/grunt build
	sed -i '/<script>document.write/,/)<\/script>/d' build/index.html
	cd build && ../node_modules/.bin/nodemon src/server/server.js
