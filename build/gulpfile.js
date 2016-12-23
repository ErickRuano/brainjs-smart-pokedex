var gulp = require('gulp'),
gp_concat = require('gulp-concat'),
gp_rename = require('gulp-rename'),
gp_minify = require('gulp-minify');
gp_selfExecute = require('gulp-self-execute');
runSequence = require('run-sequence');
jsdoc = require('gulp-jsdoc3');

gulp.task('merge', function(){
    return gulp.src(["../src/libs.js", "../src/Input.js", "../src/Pokedex.js", "../src/Crawler.js", "../src/Sample.js", "../src/index.js"])
        .pipe(gp_concat('smart-pokedex.js'))
        .pipe(gulp.dest('../dist'))
        .pipe(gulp.dest('../demo'))
});


gulp.task('wrap', function(){
    return gulp.src(["../dist/smart-pokedex.js"])
        .pipe(gp_selfExecute({}))
        .pipe(gulp.dest('../dist'))
        .pipe(gp_minify({
            mangle : false
        }))
        .pipe(gulp.dest('../dist'))
});

gulp.task('build', function(){
    runSequence('merge', function(){
        console.log('Wraping in self executing anonymous function');
        setTimeout(function(){
            runSequence('wrap', function(){
                console.log('done!');
            });
        }, 2000);
    });
})

gulp.task('default', ['build'   ], function(){});