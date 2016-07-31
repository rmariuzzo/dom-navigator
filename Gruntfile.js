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
         * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> Licensed MIT
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
                src: ['src/<%= filename %>.js'],
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
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfiles.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        },

        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'dist/jquery.checkboxes-<%= pkg.version %>.js': 'src/jquery.checkboxes.js'
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', [
        'jshint',
        'connect',
        'qunit',
        'clean',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('serve', [
        'connect',
        'watch'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'connect',
        'qunit'
    ]);

};
