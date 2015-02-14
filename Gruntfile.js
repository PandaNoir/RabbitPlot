module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var files=[
        './js/global.js',
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
            },
            test:{
                dest: './js/main.test.js',
                src:files
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
                    src: [mainJS],
                    ext: '.js.gz'
                }
                ]
            },
            lib: {
                options: {
                    mode: 'gzip'
                },
                files:[
                    {
                    expand: true,
                    src: './lib/js/*.min.js',
                    ext: '.min.js.gz'
                }
                ]
            },
            css: {
                options: {
                    mode: 'gzip'
                },
                files:[
                    {
                    expand: true,
                    src: ['css/*','./lib/css/*'],
                    ext: '.css.gz'
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
                    from: '<!--scriptlist-->',
                    to: scriptList
                },{
                    from: '<!--css-->',
                    to:'<link rel="stylesheet" href="css/style.css">'
                },{

                    from: '<div flex class="">Rabbit Plot</div>',
                    to: '<div flex class="">Rabbit Plot ver.dev</div>'
                }]

            },
            release: {
                src: ['templateIndex.html'],
                dest: 'index.html',
                replacements: [{
                    from: '<!--scriptlist-->',
                    to: '<script src="'+mainJS+'" defer></script>'
                },{
                    from: '<!--css-->',
                    to:'<link rel="stylesheet" href="css/style.min.css">'
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
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });
    grunt.registerTask('default', ['js','html','cssmin','compress:js','compress:css']);
    grunt.registerTask('html', ['replace:release','htmlmin:dist']);
    grunt.registerTask('js', ['concat:prefix','closure-compiler:frontend','clean:raw']);
    grunt.registerTask('dev', ['replace:dev']);
    grunt.registerTask('test', ['concat:test','karma']);
    grunt.registerTask('lib', ['bower:install','compress:lib']);
};
