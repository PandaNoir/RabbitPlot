module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        compress: {
            lib: {
                options: {
                    mode: 'gzip'
                },
                files:[
                    {
                    expand: true,
                    src: './lib/js/*.min.js',
                    ext: '.min.js.gz'
                },{
                    expand: true,
                    src: './lib/css/*.min.css',
                    ext: '.min.css.gz'
                }
                ]
            },
        },
        bower: {
            install: {
                options: {
                    targetDir: './lib',
                    layout : function (type, component) {
                       if (type === 'css') {
                           return 'css';
                       } else {
                           return 'js';
                       }
                    },
                    // layout: 'byType',
                    install: true,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
    });
    grunt.registerTask('lib', ['bower:install','compress:lib']);
};
