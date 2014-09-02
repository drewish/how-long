var gulp = require('gulp'); 
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');

var onSassError = function(e){
  console.log(e);
}

// Compile Our Sass
gulp.task('styles', function() {
  return gulp.src('app/scss/style.scss')
    .pipe(plumber(onSassError))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('app/dist'))
    .pipe(notify({ message: 'Styles complete' }));
});


// // Concatenate & Minify JS
// gulp.task('scripts', function() {
//   return gulp.src('app/js/*.js')
//     .pipe(concat('lib.js'))
//     .pipe(gulp.dest('app/dist'))
//     .pipe(rename('lib.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('app/dist'));
// });


// Watch
gulp.task('watch', function() {
  gulp.task('default', ['styles']);
  gulp.watch('app/scss/*.scss', ['styles'])
});

// Default Task
gulp.task('default', ['styles']);