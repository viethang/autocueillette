/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',
  app_files: {
    js: [ 'src/client/**/*.js',
	'!src/client/*.spec.js','!src/client/*.spec.js' ],
    jsunit: [ 'src/client/**/*.spec.js' ],

	atpl: [ 'src/client/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less',
	 sass: 'src/sass/main.scss'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },
  vendor_files: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/modules/route/route.js',
	  'vendor/openlayers/ol-debug.js',
	  'vendor/angular-sanitize/angular-sanitize.min.js'
    ],
    css: [
		'vendor/bootstrap/dist/css/bootstrap.css',
		'vendor/openlayers/ol.css'
    ],
    assets: [
    ]
  },
  server_files: {
	  js: ['src/server/*.js']
  }
};
