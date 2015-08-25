module.exports = function ( grunt ) {

	/**
		* Load required Grunt tasks. These are installed based on the versions listed
		* in `package.json` when you do `npm install` in this directory.
		*/
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-conventional-changelog');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-contrib-connect');
	/**
		* Load in our build configuration file.
		*/
	var userConfig = require( './build.config.js' );

	/**
		* This is the configuration object Grunt uses to give each plugin its
		* instructions.
		*/
	var taskConfig = {
		pkg: grunt.file.readJSON("package.json"),

		meta: {
			banner:
			'/**\n' +
			' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' * <%= pkg.homepage %>\n' +
			' *\n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
			' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
			' */\n'
		},

		changelog: {
			options: {
			dest: 'CHANGELOG.md',
			template: 'changelog.tpl'
			}
		},

		bump: {
			options: {
			files: [
				"package.json",
				"bower.json"
			],
			commit: false,
			commitMessage: 'chore(release): v%VERSION%',
			commitFiles: [
				"package.json",
				"client/bower.json"
			],
			createTag: false,
			tagName: 'v%VERSION%',
			tagMessage: 'Version %VERSION%',
			push: false,
			pushTo: 'origin'
			}
		},
		clean: [
			'<%= build_dir %>',
			'<%= compile_dir %>'
		],

		copy: {
			build_app_assets: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= build_dir %>/assets/',
						cwd: 'src/assets',
						expand: true
					}
				]
			},
			build_vendor_assets: {
				files: [
					{
						src: [ '<%= vendor_files.assets %>' ],
						dest: '<%= build_dir %>/assets/',
						cwd: '.',
						expand: true,
						flatten: true
					}
				]
			},
			build_appjs: {
				files: [
					{
						src: [ '<%= app_files.js %>' ],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_vendorjs: {
				files: [
					{
						src: [ '<%= vendor_files.js %>' ],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_vendorcss: {
				files: [
					{
						src: [ '<%= vendor_files.css %>' ],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_server: {
				files: [
					{
						src: [ '<%= server_files.js %>' ],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			compile_assets: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= compile_dir %>/assets',
						cwd: '<%= build_dir %>/assets',
						expand: true
					},
					{
						src: [ '<%= vendor_files.css %>' ],
						dest: '<%= compile_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			}
		},
		concat: {
			build_css: {
				src: [
					'<%= vendor_files.css %>',
					'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
				],
				dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
			},
			compile_js: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: [
					'<%= vendor_files.js %>',
					'module.prefix',
					'<%= build_dir %>/src/**/*.js',
					'<%= html2js.app.dest %>',
					'<%= html2js.common.dest %>',
					'module.suffix'
				],
				dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},


		ngAnnotate: {
			compile: {
				files: [
					{
						src: [ '<%= app_files.js %>' ],
						cwd: '<%= build_dir %>',
						dest: '<%= build_dir %>',
						expand: true
					}
				]
			}
		},

		uglify: {
			compile: {
				options: {
					banner: '<%= meta.banner %>'
				},
				files: {
					'<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
				}
			}
		},

		less: {
			build: {
				files: {
					'<%= build_dir %>/assets/style.css': '<%= app_files.less %>'
				}
			},
			compile: {
				files: {
					'<%= build_dir %>/assets/style.css': '<%= app_files.less %>'
				},
				options: {
					cleancss: true,
					compress: true
				}
			}
		},

		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			build: {
				files: {
					'<%= build_dir %>/assets/style.css': '<%= app_files.sass %>'
				}
			},
			compile: {
				files: {
					'<%= build_dir %>/assets/style.css': '<%= app_files.sass %>'
				},
				options: {
					cleancss: true,
					compress: true
				}
			}
		},

		jshint: {
			src: [
				'<%= app_files.js %>'
			],
			test: [
				'<%= app_files.jsunit %>'
			],
			gruntfile: [
				'Gruntfile.js'
			],
			options: {
				curly: true,
				immed: true,
				newcap: true,
				noarg: true,
				sub: true,
				boss: true,
				eqnull: true
			},
			globals: {}
		},


		html2js: {

			app: {
			options: {
				base: 'src/client/'
			},
			src: [ '<%= app_files.atpl %>' ],
			dest: '<%= build_dir %>/templates-app.js'
			},

			common: {
			options: {
				base: 'src/common'
			},
			src: [ '<%= app_files.ctpl %>' ],
			dest: '<%= build_dir %>/templates-common.js'
			}
		},

		karma: {
			options: {
			configFile: '<%= build_dir %>/karma-unit.js'
			},
			unit: {
			port: 9019,
			background: true
			},
			continuous: {
			singleRun: true
			}
		},

		index: {
			build: {
				dir: '<%= build_dir %>',
				src: [
					'<%= vendor_files.js %>',
					'<%= build_dir %>/src/client/**/*.js',
					'<%= html2js.common.dest %>',
					'<%= html2js.app.dest %>',
					'<%= vendor_files.css %>',
					'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
					'<%= build_dir %>/assets/style.css'
				]
			},

			compile: {
				dir: '<%= compile_dir %>',
				src: [
					'<%= concat.compile_js.dest %>',
					'<%= vendor_files.css %>',
					'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
				]
			}
		},

		karmaconfig: {
			unit: {
			dir: '<%= build_dir %>',
			src: [
				'<%= vendor_files.js %>',
				'<%= html2js.app.dest %>',
				'<%= html2js.common.dest %>',
				'<%= test_files.js %>'
			]
			}
		},

		delta: {
			options: {
				livereload: true
			},
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: [ 'jshint:gruntfile' ],
				options: {
					livereload: false
				}
			},

			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: [ 'jshint:src', 'copy:build_appjs' ]
			},

			serverjs: {
				files: ['<%= server_files.js %>'],
				tasks: ['copy:build_server']
			},

			assets: {
				files: [
					'src/assets/**/*'
				],
				tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
			},

			/**
			* When index.html changes, we need to compile it.
			*/
			html: {
				files: [ '<%= app_files.html %>' ],
				tasks: [ 'index:build' ]
			},

			/**
			* When our templates change, we only rewrite the template cache.
			*/
			tpls: {
				files: [
					'<%= app_files.atpl %>',
					'<%= app_files.ctpl %>'
				],
				tasks: [ 'html2js' ]
			},

			/**
			* When the CSS files change, we need to compile and minify them.
			*/
			less: {
				files: [ 'src/less/*.less' ],
				tasks: [ 'less:build' ]
			},
			
			sass: {
				files: ['src/**/*.scss'],
				tasks: ['sass:build']
			},

			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: [ 'jshint:test'
				],
				options: {
					livereload: false
				}
			}
//			protractor: {
//				files: ['src/client/**/*.js', 'e2e/**/.js'],
//				tasks: ['protractor:continuous']
//			}
			
		},

		protractor: {
			options: {
				configFile: "protractor_conf.js",
				noColor: false,
				// Additional arguments that are passed to the webdriver command
				args: { }
			},
			e2e: {
				options: {
					// Stops Grunt process if a test fails
					keepAlive: false
				}
			},
			continuous: {
				options: {
					keepAlive: true
				}
			}
		},

		connect: {
			options: {
				port: 8000,
				hostname: 'localhost'
			},
			test: {
				options: {
					// set the location of the application files
					base: ['']
				}
			}
		}
	};

	grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

	/**
		* In order to make it safe to just compile or copy *only* what was changed,
		* we need to ensure we are starting from a clean, fresh build. So we rename
		* the `watch` task to `delta` (that's why the configuration var above is
		* `delta`) and then add a new task called `watch` that does a clean build
		* before watching for changes.
		*/
	grunt.renameTask( 'watch', 'delta' );
	grunt.registerTask( 'watch', [ 'build', 'start-server', 'delta'] );
	grunt.registerTask('e2e-test', ['connect:test', 'protractor:e2e']);
	/**
		* The default task is to build and compile.
		*/
	grunt.registerTask( 'default', [ 'build', 'compile' ] );

	/**
		* The `build` task gets your app ready to run for development and testing.
		*/
	grunt.registerTask( 'build', [
		'clean', 'html2js', 'jshint', 'less:build', 'sass:build',
		'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
		'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss', 'copy:build_server', 'index:build'
	]);

	/**
		* The `compile` task gets your app ready for deployment by concatenating and
		* minifying your code.
		*/
	grunt.registerTask( 'compile', [
		'less:compile', 'sass:compile', 'copy:compile_assets', 'ngAnnotate',
		'concat:compile_js', 'uglify', 'index:compile', 'server:compile'
	]);

	/**
		* A utility function to get all app JavaScript sources.
		*/
	function filterForJS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.js$/ );
		});
	}

	/**
		* A utility function to get all app CSS sources.
		*/
	function filterForCSS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.css$/ );
		});
	}

	/**
		* The index.html template includes the stylesheet and javascript sources
		* based on dynamic names calculated in this Gruntfile. This task assembles
		* the list into variables for the template to use and then runs the
		* compilation.
		*/
	grunt.registerMultiTask( 'index', 'Process index.html template', function () {
		var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
		var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});
		var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});

		grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
			process: function ( contents, path ) {
			return grunt.template.process( contents, {
				data: {
					scripts: jsFiles,
					styles: cssFiles,
					version: grunt.config( 'pkg.version' )
				}
			});
			}
		});
	});

	/**
		* In order to avoid having to specify manually the files needed for karma to
		* run, we use grunt to manage the list for us. The `karma/*` files are
		* compiled as grunt templates for use by Karma. Yay!
		*/
	grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
		var jsFiles = filterForJS( this.filesSrc );

		grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', {
			process: function ( contents, path ) {
			return grunt.template.process( contents, {
				data: {
					scripts: jsFiles
				}
			});
			}
		});
	});
	
	grunt.registerTask('start-server', 'Start server', function() {
		var cp = require('child_process');
		var server = cp.spawn('nodemon', [ 'src/server/server.js' ], {cwd: './build', stdio: 'inherit'});
		server.on('error', function(err) {
			console.error('error!', err.toString());
		});
	});
};
