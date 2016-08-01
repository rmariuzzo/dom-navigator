(function () {
    'use strict';

    module.exports = (grunt) => {

        // Load all grunt tasks
        require('load-grunt-tasks')(grunt);

        // Show elapsed time at the end
        require('time-grunt')(grunt);

        // Project configuration.
        grunt.initConfig({

            // Metadata.
            pkg: grunt.file.readJSON('package.json'),

            banner: `/*!
 * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>
 *
 * <%= pkg.homepage %>
 * Copyright (c) 2014, <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> Licensed MIT
 */
`,

            filename: 'dom-navigator',

            // Task configuration.
            clean: {
                files: ['dist']
            },

            concat: {
                options: {
                    banner: '<%= banner %>',
                    stripBanners: true
                },
                dist: {
                    src: ['dist/<%= filename %>.js'],
                    dest: 'dist/<%= filename %>.js'
                }
            },

            uglify: {
                options: {
                    banner: '<%= banner %>'
                },
                dist: {
                    src: '<%= concat.dist.dest %>',
                    dest: 'dist/<%= filename %>.min.js'
                }
            },

            qunit: {
                all: {
                    options: {
                        urls: ['http://0.0.0.0:9000/test/main.html']
                    }
                }
            },

            connect: {
                server: {
                    options: {
                        hostname: '*',
                        port: 9000
                    }
                }
            },

            jshint: {
                options: {
                    jshintrc: true,
                    reporter: require('jshint-stylish')
                },
                gruntfile: ['Gruntfile.js'],
                src: ['src/**/*.js'],
                test: ['test/**/*.js']
            },

            watch: {
                gruntfile: {
                    files: '<%= jshint.gruntfile %>',
                    tasks: ['jshint:gruntfile']
                },
                src: {
                    files: '<%= jshint.src %>',
                    tasks: ['jshint', 'babel', 'qunit']
                },
                test: {
                    files: '<%= jshint.test %>',
                    tasks: ['jshint', 'babel', 'qunit']
                }
            },

            babel: {
                options: {
                    sourceMap: false,
                    presets: ['es2015']
                },
                dist: {
                    files: {
                        'dist/<%= filename %>.js': 'src/<%= filename %>.js'
                    }
                }
            }
        });

        // Default task.
        grunt.registerTask('default', [
            'clean',
            'jshint',
            'babel',
            'connect',
            'qunit',
            'concat',
            'uglify'
        ]);

        grunt.registerTask('serve', [
            'connect',
            'watch'
        ]);

        grunt.registerTask('test', [
            'clean',
            'jshint',
            'babel',
            'connect',
            'qunit'
        ]);

    };

})();
