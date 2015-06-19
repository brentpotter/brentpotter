'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del');

gulp.task("concatScripts", function() {
  return gulp.src([
    'js/main.js'])
  .pipe(concat("app.js"))
  .pipe(gulp.dest("js"));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/app.js")
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('sassCompile', function() {
  return gulp.src("scss/**/*.scss")
  .pipe(maps.init())
  .pipe(sass({
    // includePaths: require('node-bourbon').with('other/path', 'another/path') 
    // - or - 
    includePaths: require('node-bourbon').includePaths
  }))
  // .pipe(maps.write('./'))
  .pipe(gulp.dest('css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('scss/**/*.scss', ['sassCompile']);
  gulp.watch('js/main.js', ['concatScripts']);
});

gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app.*.js*']);
});

gulp.task('serve', ['watchFiles']);

gulp.task("build", ['minifyScripts', 'sassCompile'], function() {
  return gulp.src(["css/application.css*", "js/app.min.js", '*.html', "img/**"], { base: './'})
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});