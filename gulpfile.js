'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
     del = require('del'),
     livereload = require('gulp-livereload'),
     minifyCSS = require('gulp-minify-css'),
     rsync = require('gulp-rsync');

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
  .pipe(gulp.dest('js'))
  .pipe(livereload());
});

gulp.task('sassCompile', function() {
  return gulp.src("scss/**/*.scss")
  .pipe(maps.init())
  .pipe(sass({
    includePaths: require('node-neat').includePaths
  }))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(minifyCSS())
  .pipe(rename('application.min.css'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('css'))
  .pipe(livereload());
});

gulp.task('watchFiles', function() {
  livereload.listen();
  gulp.watch('scss/**/*.scss', ['sassCompile']);
  gulp.watch('js/main.js', ['concatScripts']);
});

gulp.task('deploy', ['clean', 'build'], function() {
  return gulp.src('dist/**/*.*')
    .pipe(rsync({
      root: 'dist',
      hostname: '107.170.124.191',
      username: 'root',
      destination: '/usr/share/nginx/html/staging'
    }));
});

gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app.*.js*']);
});

gulp.task('serve', ['watchFiles']);

gulp.task("build", ['minifyScripts', 'sassCompile'], function() {
  return gulp.src(["css/application.min.css", "js/app.min.js", '*.html', "img/**"], { base: './'})
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});