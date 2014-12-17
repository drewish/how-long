"use strict";
/* global require */

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var exec = require('child_process').exec;
var mainBowerFiles = require('main-bower-files');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var onError = function(e){
  console.log(e);
};

// Views task
gulp.task('views', function() {
  // Get our index.html and put it in the dist folder
  return gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'));
});

// Compile Our Sass
gulp.task('styles', function() {
  return gulp.src('scss/style.scss')
    .pipe(plumber(onError))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  var bowerPaths = {
    bowerDirectory: 'bower_components',
    bowerrc: '.bowerrc',
    bowerJson: 'bower.json'
  };
  return gulp.src(mainBowerFiles(bowerPaths).concat('js/*.js'))
    .pipe(concat('all.js'))
    // .pipe(gulp.dest('dist/js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('deploy', function (cb) {
  exec('git subtree push --prefix dist origin gh-pages', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

// Run a local webserver and watch for changes
gulp.task('watch', function() {
  gulp.start('default');
  connect.server({
    port: 8000,
    // livereload: true
  });
  gulp.watch('app/*.html', ['views']);
  gulp.watch('scss/*.scss', ['styles']);
  gulp.watch('js/*.js', ['scripts']);
});

// Default Task
gulp.task('default', ['views', 'styles', 'scripts']);
