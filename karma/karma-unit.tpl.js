module.exports = function ( karma ) {
  karma.set({
    basePath: '../',
    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      <% scripts.forEach( function ( file ) { %>'<%= file %>',
      <% }); %>
	'vendor/angular-mocks/angular-mocks.js',
      'src/client/**/*.js',
      'src/server/**/*.js'
    ],
    exclude: [
      'src/assets/**/*.js',
		'src/server/**/*.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher'],
    reporters: 'dots',
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',
    autoWatch: false,
    browsers: [
      'PhantomJS'
    ]
  });
};

