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
                    useHelpers: true,
                    defaultTimeout: 2*10*1000,
                },
                // spec files
                specs: [
                    'spec/integration-test/**/*.js',
                    'lib/**/spec/**/*.js',
                    'spec/**/*.js'
                ]
            },
            acceptance: {
                // target specific options
                options: {
                    useHelpers: true
                },
                // spec files
                specs: [
                    'spec/acceptance/**/*.js',
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);

    var server;

    grunt.registerTask('acceptance-setup', 'Setup server.', function () {
        grunt.log.writeln('Setup server');
        server = require('sentinel-restapi')();
        var done = this.async();
        server.start(done);
    });

    grunt.registerTask('acceptance-run', 'Run acceptance tests.', function () {
        try {
            grunt.task.run('jasmine_nodejs:acceptance');
        }catch(e){
            grunt.log.writeln(e);
        }
    });

    grunt.registerTask('acceptance-teardown', 'Teardown server.', function () {
        grunt.log.writeln('Teardown server');
        if(server) {
            var done = this.async();
            server.stop(done);
        }
    });

    grunt.registerTask('acceptance-test', ['acceptance-setup', 'acceptance-run', 'acceptance-teardown']);

};
