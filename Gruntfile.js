module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var files=[
        './js/mainCtrl.js',
        './js/calendarCtrl.js',
        './js/eventEditorCtrl.js',
        './js/groupEditorCtrl.js',
        './js/detailCtrl.js',
        './js/settingCtrl.js',
        './js/eventListCtrl.js',
        './js/factory.js'
    ];
    var scriptList='';
    for(var i=0,j=files.length;i<j;i++){
        scriptList+='<script src="'+files[i]+'" defer></script>';
    }
    files.unshift('js/rabbit.prefix');
    files.push('js/rabbit.suffix');

    var mainJS='./js/main.js';
    var mainRawJS='./js/main.raw.js';
    var mainPrettyJS='./js/main.pretty.js';
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
                closurePath: './compiler-latest/',
                js: mainRawJS,
                jsOutputFile: mainJS,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            },
            frontend_debug: {
                closurePath: './compiler-latest/',
                js: mainJS,
                jsOutputFile: mainPrettyJS,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    formatting:'PRETTY_PRINT'
                }
            }
        },
        clean: {
            raw: [mainRawJS]
        },
        replace: {
            dev: {
                src: ['templateIndex.html'],
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
                src: ['templateIndex.html'],
                dest: 'index.html',
                replacements: [{
                    from: '<tmpl scriptlist></tmpl>',
                    to: '<script src="'+mainJS+'" defer></script>'
                }]
            }
        },
        htmlmin: {
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'index.html': 'index.html'     // 'destination': 'source'
                }
            }
         },
         cssmin: {
             target: {
                 files: [{
                     expand: true,
                     cwd: 'css',
                     src: ['*.css', '!*.min.css'],
                     dest: 'css',
                     ext: '.min.css'
                 }]
             }
         }
    });
    grunt.registerTask('default', ['concat','closure-compiler:frontend','clean:raw','compress','replace:release','htmlmin:dist','cssmin']);
    grunt.registerTask('dev', ['replace:dev']);
    grunt.registerTask('pretty', ['closure-compiler:frontend_debug']);
};
