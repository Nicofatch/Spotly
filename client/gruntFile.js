	module.exports = function (grunt) {

		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-copy');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-sass');
		grunt.loadNpmTasks('grunt-karma');
		grunt.loadNpmTasks('grunt-html2js');
		grunt.loadNpmTasks('grunt-webfont');

	// Default task.
	grunt.registerTask('default', ['jshint','build'/*,'karma:unit'*/]);
	grunt.registerTask('build', ['clean','html2js','concat','webfont','sass','copy:assets']);
	grunt.registerTask('release', ['clean','html2js','jshint',/*'karma:unit',*/'concat:index','concat:styles','sass','webfont','copy:assets','uglify']);
	//grunt.registerTask('test-watch', ['karma:watch']);

	// Print a timestamp (useful for when watching)
	grunt.registerTask('timestamp', function() {
		grunt.log.subhead(Date());
	});

	var karmaConfig = function(configFile, customOptions) {
		var options = { configFile: configFile, keepalive: true };
		var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
		return grunt.util._.extend(options, customOptions, travisOptions);
	};

	// Project configuration.
	grunt.initConfig({
		distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		banner:
		'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
		' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n */\n',
		src: {
			js: ['src/**/*.js'],
			jsTpl: ['<%= distdir %>/templates/**/*.js'],
			specs: ['test/**/*.spec.js'],
			scenarios: ['test/**/*.scenario.js'],
			html: ['src/index.html'],
			tpl: {
				app: ['src/app/**/*.tpl.html'],
				common: ['src/common/**/*.tpl.html']
			},
			sass:['src/sass/**/*.scss'],
			css:['src/css/**/*.css']
		},
		sass: {
			dist: {
				files: {
					'<%= distdir %>/<%= pkg.name %>.css' : 'src/sass/**/*.scss'
				}
			}
		},
		clean: ['<%= distdir %>/*'],
		copy: {
			assets: {
				files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
			}
		},
		// karma: {
		//   unit: { options: karmaConfig('test/config/unit.js') },
		//   watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
		// },
		html2js: {
			app: {
				options: {
					base: 'src/app'
				},
				src: ['<%= src.tpl.app %>'],
				dest: '<%= distdir %>/templates/app.js',
				module: 'templates.app'
			},
			common: {
				options: {
					base: 'src/common'
				},
				src: ['<%= src.tpl.common %>'],
				dest: '<%= distdir %>/templates/common.js',
				module: 'templates.common'
			}
		},
		concat:{
			dist:{
				options: {
					banner: "<%= banner %>"
				},
				src:['<%= src.js %>', '<%= src.jsTpl %>'],
				dest:'<%= distdir %>/<%= pkg.name %>.js'
			},
			index: {
				src: ['src/index.html'],
				dest: '<%= distdir %>/index.html',
				options: {
					process: true
				}
			},
			angular: {
				src:['vendor/angular/angular.js', 'vendor/angular/*.js'],
				dest: '<%= distdir %>/angular.js'
			},
			// mongo: {
			//   src:['vendor/mongolab/*.js'],
			//   dest: '<%= distdir %>/mongolab.js'
			// },
			bootstrap: {
				src:['vendor/bootstrap/tooltip.js', 'vendor/bootstrap/*.js'],
				dest: '<%= distdir %>/bootstrap.js'
			},
			jquery: {
				src:['vendor/jquery/wysihtml5-0.3.0.js','vendor/jquery/*.js'],
				dest: '<%= distdir %>/jquery.js'
			},
			leaflet: {
				src:['vendor/leaflet/leaflet.js', 'vendor/leaflet/*.js'],
				dest: '<%= distdir %>/leaflet.js'
			},
			styles: {
				src:['src/css/**/*.css', '!src/css/vendor/editor.css', '<%= distdir %>/icons.css'],
				dest: '<%= distdir %>/styles.css'
			}
		},
		uglify: {
			dist:{
				options: {
					banner: "<%= banner %>"
				},
				src:['<%= src.js %>', '<%= src.jsTpl %>'],
				dest:'<%= distdir %>/<%= pkg.name %>.js'
			},
			angular: {
				src:['vendor/angular/angular.js', 'vendor/angular/*.js'],
				dest: '<%= distdir %>/angular.js'
			},
			// mongo: {
			//   src:['vendor/mongolab/*.js'],
			//   dest: '<%= distdir %>/mongolab.js'
			// },
			bootstrap: {
				src:['vendor/bootstrap/tooltip.js', 'vendor/bootstrap/*.js'],
				dest: '<%= distdir %>/bootstrap.js'
			},
			jquery: {
				src:['vendor/jquery/wysihtml5-0.3.0.js','vendor/jquery/*.js'],
				dest: '<%= distdir %>/jquery.js'
			},
			leaflet: {
				src:['vendor/leaflet/leaflet.js', 'vendor/leaflet/*.js'],
				dest: '<%= distdir %>/leaflet.js'
			}
		},
		watch:{
			build: {
				files:['<%= src.js %>', '<%= src.specs %>', '<%= src.sass %>', '<%= src.css %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
				tasks:['build','timestamp'],
				options: {
					//livereload: true // needed to run LiveReload
				}
			}
		},
		webfont:{
			icons: {
				src: 'src/icons/*.svg',
				dest: '<%= distdir %>/fonts',
				destCss: '<%= distdir %>',
			}
		},
		jshint:{
			files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>', '!**/templates/app.js','!**/templates/common.js'],
			options:{
				curly:true,
				eqeqeq:true,
				immed:true,
				latedef:true,
				newcap:true,
				noarg:true,
				sub:true,
				boss:true,
				eqnull:true,
				globals:{}
			}
		}
	});

};
