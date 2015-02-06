module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var files=[
        'js/mainCtrl.js',
        'js/calendarCtrl.js',
        'js/eventEditorCtrl.js',
        'js/groupEditorCtrl.js',
        'js/detailCtrl.js',
        'js/settingCtrl.js',
        'js/eventListCtrl.js',
        'js/factory.js',
        'js/eventCal.js',
    ];
    files.unshift('js/rabbit.prefix');
    files.push('js/rabbit.suffix');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.initConfig({
        concat: {
            prefix:{
                dest: 'js/main.raw.js',
                src: files
            }
        },
        compress: {
            js: {
                options: {
                    mode: 'gzip'
                },
                files:[
                    {
                    expand: true,
                    src: 'js/main.js',
                    ext: '.js.gz'
                }
                ]
            }
        },
        'closure-compiler': {
            frontend: {
                closurePath: 'compiler-latest/',
                js:'js/main.raw.js',
                jsOutputFile:'js/main.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },
        clean: {
            raw: ['js/main.raw.js']
        }
    });
    grunt.registerTask('default', ['concat','closure-compiler','clean:raw','compress']);
};
