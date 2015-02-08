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
    var scriptList='';
    for(var i=0,j=files.length;i<j;i++){
        scriptList+='<script src="'+files[i]+'" defer></script>';
    }
    files.unshift('js/rabbit.prefix');
    files.push('js/rabbit.suffix');

    var mainJS='js/main.js';
    var mainRawJS='js/main.raw.js';
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat: {
            prefix:{
                dest: mainRawJS,
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
                    src: mainJS,
                    ext: '.js.gz'
                }
                ]
            }
        },
        'closure-compiler': {
            frontend: {
                closurePath: 'compiler-latest/',
                js: mainRawJS,
                jsOutputFile: mainJS,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },
        clean: {
            raw: [mainRawJS]
        },
        replace: {
            dev: {
                src: ['indexTmpl.html'],
                dest: 'index.html',
                replacements: [{
                    from: '<tmpl scriptlist></tmpl>',
                    to: scriptList
                },{
                    from: '<div flex class="">Rabbit Plot</div>',
                    to: '<div flex class="">Rabbit Plot ver.dev</div>'
                }]

            },
            release: {
                src: ['indexTmpl.html'],
                dest: 'index.html',
                replacements: [{
                    from: '<tmpl scriptlist></tmpl>',
                    to: '<script src="'+mainJS+'" defer></script>'
                }]
            }
        }
    });
    grunt.registerTask('default', ['concat','closure-compiler','clean:raw','compress','replace:release']);
    grunt.registerTask('dev', ['replace:dev']);
};
