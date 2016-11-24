/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/spec/**/*.js', 'spec/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: 'lib/**/spec/**/*.js',
                tasks: ['jasmine_nodejs']
            }
        },
        karma_conf: {
            files: [
                'lib/**/src/**/*.js',
                'lib/**/spec/**/*.js'
            ],
            // coverage reporter generates the coverage
            reporters: ['progress', 'coverage'],
            preprocessors: {
                'lib/**/src/**/*.js': ['coverage']
            }
        },
        jasmine_nodejs: {
            options: {
                specNameSuffix: "spec.js",
                random: false,
                defaultTimeout: null, // defaults to 5000
                stopOnFailure: false,
                traceFatal: true,
                // configure one or more built-in reporters
                reporters: {
                    console: {
                        colors: true,        // (0|false)|(1|true)|2
                        cleanStack: 1,       // (0|false)|(1|true)|2|3
                        verbosity: 4,        // (0|false)|1|2|3|(4|true)
                        listStyle: "indent", // "flat"|"indent"
                        activity: false
                    }
                },
                // add custom Jasmine reporter(s)
                customReporters: []
            },
            your_target: {
                // target specific options
                options: {
                    useHelpers: true
                },
                // spec files
                specs: [
                    'lib/**/spec/**/*.js',
                    'spec/**/*.js'
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint']);

};