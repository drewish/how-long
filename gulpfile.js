var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var mainBowerFiles = require('main-bower-files');

var onError = function(e){
  console.log(e);
};

// Compile Our Sass
gulp.task('styles', function() {
  return gulp.src('app/scss/style.scss')
    .pipe(plumber(onError))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('app/dist'));
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
  var bowerPaths = {
    bowerDirectory: 'app/bower_components',
    bowerrc: '.bowerrc',
    bowerJson: 'bower.json'
  };
  return gulp.src(mainBowerFiles(bowerPaths).concat('app/js/*.js'))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/dist'));
});


// Watch
gulp.task('watch', function() {
  gulp.start('default');
  gulp.watch('app/scss/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['scripts']);
});

// Default Task
gulp.task('default', ['styles', 'scripts']);
