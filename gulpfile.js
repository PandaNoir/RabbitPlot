var gulp=require('gulp'),concat=require('gulp-concat'),minifyCss=require('gulp-minify-css'),closure=require('gulp-closure-compiler'),gzip=require('gulp-gzip'),karma=require('gulp-karma'),minifyHtml=require('gulp-minify-html'),replace=require('gulp-replace'),rimraf=require('rimraf'),rename=require('gulp-rename'),_=require('lodash');

var path = {
    js: [
        './js/global.js','./js/mainCtrl.js','./js/calendarCtrl.js','./js/eventEditorCtrl.js','./js/groupEditorCtrl.js',
        './js/detailCtrl.js','./js/settingCtrl.js','./js/eventListCtrl.js','./js/factory.js','./js/directive.js'
    ],
    lib: ['./lib/js/angular.min.js','./lib/js/angular-touch.min.js','./lib/js/angular-animate.min.js','./lib/js/angular-aria.min.js','./lib/js/angular-messages.min.js','./lib/js/angular-material.min.js','./lib/js/lodash.min.js'],
    css: ['./css/style.css']
};
var mainJS='main.js',mainRawJS='main.raw.js',mainPrettyJS='main.pretty.js';
function wrap(files,name){
    files.unshift('./js/'+name+'.prefix');
    files.push('./js/'+name+'.suffix');
    return files;
}

gulp.task('concat', function() {
    gulp.src(wrap(path.js,'rabbit'))
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
        throw err;
    });
});
gulp.task('minify',['concat'],function(cb){
    gulp.src('./js/'+mainRawJS)
    .pipe(closure({
        compilerPath: './compiler-latest/build/compiler.jar',
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT5_STRICT',
        fileName: mainJS
    }))
    .pipe(gulp.dest('./js/'));
    rimraf('./js/'+mainRawJS,cb);
    gulp.src(path.lib)
    .pipe(gzip())
    .pipe(gulp.dest('./lib/js'));
});
gulp.task('dev',function(){
    gulp.src('templateIndex.html')
    .pipe(replace(/<!--scriptlist-->/,_.map(path.js,function(s){return '<script src="'+s+'" defer></script>'}).join('')))
    .pipe(replace(/<!--css-->/,'<link rel="stylesheet" href="css/style.css">'))
    .pipe(replace(/<div flex class="">Rabbit Plot<\/div>/,'<div flex class="">Rabbit Plot ver.dev</div>'))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
});
gulp.task('release',function(){
    gulp.src(['templateIndex.html'])
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
});

gulp.task('default', ['minify','release','cssmin']);
gulp.task('test', ['karma']);
//grunt.registerTask('lib', ['bower:install','compress:lib']);
