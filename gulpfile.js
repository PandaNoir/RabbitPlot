var gulp=require('gulp'),concat=require('gulp-concat'),minifyCss=require('gulp-minify-css'),closureCompiler=require('gulp-closure-compiler'),gzip=require('gulp-gzip'),karma=require('gulp-karma'),minifyHtml=require('gulp-minify-html'),replace=require('gulp-replace'),rimraf=require('rimraf'),rename=require('gulp-rename'),ngAnnotate=require('gulp-ng-annotate'),_=require('lodash');

var path = {
    js: [
        './js/calendar.js',
        './js/global.js',
        './js/mainCtrl.js',
        './js/calendarCtrl.js',
        './js/eventEditorCtrl.js',
        './js/groupEditorCtrl.js',
        './js/detailCtrl.js',
        './js/settingCtrl.js',
        './js/eventListCtrl.js',
        './js/factory.js',
        './js/directive.js'
    ],
    lib: [
        './lib/js/angular.min.js',
        './lib/js/angular-aria.min.js',
        './lib/js/angular-animate.min.js',
        './lib/js/angular-touch.min.js',
        './lib/js/angular-messages.min.js',
        './lib/js/angular-local-storage.min.js',
        './js/angular-material.min.js',
        './js/sha512.js',
        './lib/js/lodash.min.js'
    ],
    libcss: ['./lib/css/angular-material.min.css'],
    css: ['./css/style.css','./css/angular-material.css']
};
var mainJS='main.js',mainRawJS='main.raw.js',mainPrettyJS='main.pretty.js';
function wrap(files,name){
    files.unshift('./js/'+name+'.prefix');
    files.push('./js/'+name+'.suffix');
    return files;
};
gulp.task('concat', function() {
    return gulp.src(wrap(path.js,'rabbit'))
    .pipe(concat(mainRawJS))
    .pipe(gulp.dest('./js/'));
});

gulp.task('karma',['concat'], function() {
    gulp.src(path.lib.concat(['./lib/js/angular-mocks.js','./js/'+mainRawJS,'./spec/*.js']))
    .pipe(karma({
        configFile: './karma.conf.js',
        action: 'run',
        singleRun: true
    })).on('error',function(err){
        console.error(err);
    });
});
gulp.task('minify',['concat'],function(cb){
    gulp.src('./js/main.raw.js')
    .pipe(ngAnnotate())
    .pipe(closureCompiler({
        compilerPath: './bower_components/closure-compiler/compiler.jar',
        fileName: 'main.js',
        compilerFlags:{
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            language_in: 'ECMASCRIPT5_STRICT'
        }
    }))
    .pipe(gulp.dest('./js/'))

    .pipe(gzip())
    .pipe(gulp.dest('./js/'))
    .on('end',function(){
        rimraf('./js/'+mainRawJS,cb);
    });

    gulp.src(path.lib)
    .pipe(gzip())
    .pipe(gulp.dest('./lib/js'));
});
gulp.task('dev',function(){
    gulp.src('templateIndex.html')
    .pipe(replace(/<!--liblist-->/,_.map(path.lib,function(s){return '<script src="'+s+'" defer></script>'}).join('')))
    .pipe(replace(/<!--scriptlist-->/,_.map(path.js,function(s){return '<script src="'+s+'" defer></script>'}).join('')))
    .pipe(replace(/<!--css-->/,'<link rel="stylesheet" href="css/style.css">'))
    .pipe(replace(/<div flex class="">Rabbit Plot<\/div>/,'<div flex class="">Rabbit Plot ver.dev</div>'))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
});
gulp.task('release',function(){
    gulp.src(['templateIndex.html'])
    .pipe(replace(/<!--liblist-->/,_.map(path.lib,function(s){return '<script src="'+s+'" defer></script>'}).join('')))
    .pipe(replace(/<!--scriptlist-->/,'<script src="js/'+mainJS+'" defer></script>'))
    .pipe(replace(/<!--css-->/,'<link rel="stylesheet" href="css/style.min.css">'))
    .pipe(minifyHtml({
        quotes:true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
});
gulp.task('cssmin',function(){
    gulp.src(path.css)
    .pipe(rename({
        extname:'.min.css'
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./css'))
    .pipe(gzip())
    .pipe(gulp.dest('./css'));

    gulp.src(path.libcss)
    .pipe(minifyCss())
    .pipe(gulp.dest('./lib/css'))
    .pipe(gzip())
    .pipe(gulp.dest('./lib/css'));
});

gulp.task('default', ['minify','release','cssmin']);
gulp.task('test', ['karma']);
//grunt.registerTask('lib', ['bower:install','compress:lib']);
