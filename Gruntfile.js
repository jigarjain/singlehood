/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-jscs' );

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['**/*.js']
        },
        csslint: {
            options: {
                csslintrc: 'io/static/.csslintrc'
            },
            all: 'io/static/css/app.css'
        },
        less: {
            options: {
                compress: true
            },
            dist: {
                files: {
                    'io/static/css/app.css': 'io/static/css/app.less'
                }
            }
        },
        jscs: {
            all: ['io/static/*.js', 'io/static/js/**/*.js']
        },
        watch: {
            files: [
                '<%= jshint.all %>',
                'io/static/css/**/*.less',
                '.{csslintrc,jscsrc,jshintrc,jshintignore}'
            ],
            tasks: ['test']
        }
    } );

    grunt.registerTask( 'build', [ 'less' ] );
    grunt.registerTask( 'test', [ 'build', 'jshint', 'jscs', 'csslint' ] );
    grunt.registerTask( 'default', 'test' );
};
